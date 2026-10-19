import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  mkdir, mkdtemp, readdir, readFile, realpath, rename, rm, writeFile,
} from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { binding } from '../service-lifecycle.mjs';

// T3a: one dashboard per repository, isolated per `.lazyqoder` store. The
// runtime-neutral `.lazyseries/project.json` registry is the only shared
// surface, so a foreign runtime (LazyBuddy, LazyTrae) reaching for this root
// must refuse typed without touching Qoder's store bytes, and Qoder's own
// dashboard surfaces must resolve their store roots only inside `.lazyqoder`.
const HOST = fileURLToPath(new URL('../', import.meta.url));
const PLUGIN_ROOT = resolve(HOST, '../..');
const PROJECT_CLI = join(HOST, 'project.mjs');
const PROJECT_ID = 'project:store-isolation';
const ACTOR = 'test:store-isolation';

// The sibling plugins share one worktrees checkout layout
// (<worktrees>/<Name>/1.4.0-completion/<name>-plugin); when present the real
// foreign CLIs are exercised against the same root. In a standalone clone the
// cross-runtime half skips and the hand-authored foreign-identity half below
// still proves the refusal.
const WORKTREES = resolve(PLUGIN_ROOT, '../../..');
const BUDDY_CLI = join(WORKTREES, 'LazyBuddy/1.4.0-completion/lazybuddy-plugin/shared/project/cli.mjs');
const TRAE_CLI = join(WORKTREES, 'LazyTrae/1.4.0-completion/lazytrae-plugin/packages/cli/src/index.js');
const buddyAvailable = existsSync(BUDDY_CLI);
const traeAvailable = existsSync(TRAE_CLI);

const hash = value => createHash('sha256').update(value).digest('hex');

function run(argv, options = {}) {
  return new Promise((resolve_, reject) => {
    const child = spawn(argv[0], argv.slice(1), { cwd: options.cwd, shell: false,
      env: { ...process.env, ...options.env }, stdio: ['pipe', 'pipe', 'pipe'], timeout: 30000 });
    const output = []; const errors = [];
    child.stdout.on('data', chunk => output.push(chunk));
    child.stderr.on('data', chunk => errors.push(chunk));
    child.on('error', reject);
    child.stdin.on('error', error => { if (error.code !== 'EPIPE') reject(error); });
    child.on('close', (code, signal) => resolve_({
      code, signal,
      stdout: Buffer.concat(output).toString('utf8'),
      stderr: Buffer.concat(errors).toString('utf8'),
    }));
    child.stdin.end(options.input === undefined ? '' : options.input);
  });
}

const qoder = (root, action, input) => run([process.execPath, PROJECT_CLI, action,
  '--project-root', root, '--project-id', PROJECT_ID, '--actor', ACTOR], { cwd: root, input });

async function storeInventory(root) {
  const files = {};
  const visit = async directory => {
    for (const entry of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
      const target = join(directory, entry.name);
      if (entry.isDirectory()) await visit(target);
      else files[relative(root, target)] = hash(await readFile(target));
    }
  };
  for (const namespace of ['.lazyqoder', '.lazyseries']) {
    const store = join(root, namespace);
    if (existsSync(store)) await visit(store);
  }
  return files;
}

async function fixture(t, name) {
  const root = await realpath(await mkdtemp(join(tmpdir(), `lazyqoder-store-isolation-${name}-`)));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('own init owns one store; sibling foreign-runtime CLIs refuse and leave every store byte unchanged', async t => {
  const root = await fixture(t, 'matrix');
  await mkdir(join(root, 'docs'), { recursive: true, mode: 0o700 });
  await writeFile(join(root, 'docs/execution-plan.md'), '# Plan\n\n- [x] [C1] Isolation criterion\n', { mode: 0o600 });

  const initialized = await qoder(root, 'init');
  assert.equal(initialized.code, 0, initialized.stderr);
  assert.equal(existsSync(join(root, '.lazyqoder/project/owner.json')), true, 'Qoder init creates its own store owner');
  assert.equal(existsSync(join(root, '.lazyqoder/project/state.json')), true, 'Qoder init creates its own state document');
  const registry = JSON.parse(await readFile(join(root, '.lazyseries/project.json'), 'utf8'));
  assert.equal(registry.runtime, 'LazyQoder');
  assert.equal(registry.project_id, PROJECT_ID);
  const owned = await storeInventory(root);
  assert.ok(Object.keys(owned).length >= 3, 'the snapshot covers registry, owner and state bytes');

  // Foreign runtime: the real Buddy CLI, carrying the registry's own project id
  // so the only foreign fact is the owning runtime.
  if (!buddyAvailable) t.skip(`LazyBuddy worktree CLI not found at ${BUDDY_CLI}`);
  else {
    const refused = await run([process.execPath, BUDDY_CLI, 'init', '--project-root', root,
      '--project-id', PROJECT_ID, '--actor', 'cross:buddy'], { cwd: root });
    assert.notEqual(refused.code, 0, 'Buddy init must fail closed');
    assert.equal(refused.stderr.trim(), 'REGISTRY_FOREIGN_RUNTIME');
    assert.equal(existsSync(join(root, '.lazybuddy')), false,
      'a refused Buddy init creates no second native store directory');
  }
  // Foreign runtime: the real LazyTrae CLI against the same root. Trae anchors
  // its repository root at the working directory, so it runs from the root.
  if (!traeAvailable) t.skip(`LazyTrae worktree CLI not found at ${TRAE_CLI}`);
  else {
    const refused = await run([process.execPath, TRAE_CLI, 'project', 'init', '--actor', 'cross:trae'], { cwd: root });
    assert.equal(refused.code, 1, `Trae init must fail closed: ${refused.stdout}${refused.stderr}`);
    assert.equal(JSON.parse(refused.stderr).code, 'REGISTRY_FOREIGN_RUNTIME');
    assert.equal(existsSync(join(root, '.lazytrae/state/project.json')), false,
      'a refused Trae init creates no Trae state document');
  }
  // No cross-store mutation: every Qoder and registry byte is unchanged after
  // the foreign attempts, whatever scaffolding the foreign runtime left in its
  // own namespace.
  assert.deepEqual(await storeInventory(root), owned,
    'foreign-runtime init attempts must leave the owning store byte-identical');
  // The owning runtime keeps full service after the refusals.
  const reread = await qoder(root, 'read');
  assert.equal(reread.code, 0, reread.stderr);
  assert.equal(JSON.parse(reread.stdout).repository_key, registry.repository_key);
  t.diagnostic(JSON.stringify({ buddy_cli_exercised: buddyAvailable, trae_cli_exercised: traeAvailable,
    refusal: 'REGISTRY_FOREIGN_RUNTIME', store_bytes_unchanged: true }));
});

// F-04 portable half: a registry whose only foreign fact is the owning runtime
// refuses init typed, and the shared source pointer list never flaps.
test('a foreign-runtime registry refuses init and the source mirror without adopting or flapping', async t => {
  const root = await fixture(t, 'foreign-registry');
  await mkdir(join(root, 'docs'), { recursive: true, mode: 0o700 });
  await writeFile(join(root, 'docs/execution-plan.md'), '# Plan\n\n- [x] [C1] Isolation criterion\n', { mode: 0o600 });
  assert.equal((await qoder(root, 'init')).code, 0);
  const mirrored = await qoder(root, 'command', JSON.stringify({
    schema_version: 1, command_id: 'iso:mirror:1', project_id: PROJECT_ID, expected_revision: 0,
    operation: 'register_source', payload: { id: 'source:plan', path: 'docs/execution-plan.md', role: 'plan' },
  }));
  assert.equal(JSON.parse(mirrored.stdout).receipt.status, 'saved', mirrored.stderr);
  const registryPath = join(root, '.lazyseries/project.json');
  const mirroredRegistry = JSON.parse(await readFile(registryPath, 'utf8'));
  assert.equal(mirroredRegistry.runtime, 'LazyQoder');
  assert.deepEqual(mirroredRegistry.sources.map(source => source.id), ['source:plan']);

  // Damaged state: the shared registry names another owning runtime while the
  // store identity stays bound. Init and a further mutation must refuse
  // instead of flapping the foreign source pointer list.
  await writeFile(join(root, 'docs/other-plan.md'), '# Other plan\n', { mode: 0o600 });
  const flipped = { ...mirroredRegistry, runtime: 'LazyBuddy' };
  await writeFile(registryPath, `${JSON.stringify(flipped)}\n`);
  const foreignBytes = await readFile(registryPath);
  for (let attempt = 1; attempt <= 2; attempt++) {
    const refused = await qoder(root, 'init');
    assert.notEqual(refused.code, 0, `foreign-runtime init attempt ${attempt} must fail closed`);
    assert.equal(refused.stderr.trim(), 'REGISTRY_FOREIGN_RUNTIME');
    assert.equal((await readFile(registryPath)).equals(foreignBytes), true,
      'a refused init must leave the foreign registry byte-identical');
  }
  const flapped = await qoder(root, 'command', JSON.stringify({
    schema_version: 1, command_id: 'iso:mirror:2', project_id: PROJECT_ID, expected_revision: 1,
    operation: 'register_source', payload: { id: 'source:other', path: 'docs/other-plan.md', role: 'plan' },
  }));
  assert.notEqual(flapped.code, 0, 'a foreign-runtime registry must not be mirrored');
  assert.equal(flapped.stderr.trim(), 'REGISTRY_FOREIGN_RUNTIME');
  assert.equal((await readFile(registryPath)).equals(foreignBytes), true,
    'the refused mirror leaves the foreign registry byte-identical');
  t.diagnostic(JSON.stringify({ refusal: 'REGISTRY_FOREIGN_RUNTIME', registry_bytes_stable: true,
    mirror_refused: true }));
});

test('the dashboard service resolves its store root only inside .lazyqoder', async t => {
  const root = await fixture(t, 'namespace');
  assert.equal((await qoder(root, 'init')).code, 0);

  // Service binding: the resolved dashboard store root (locks, receipts,
  // credentials) lives under `.lazyqoder/dashboard` and never under a foreign
  // namespace or the shared registry directory.
  const projectBound = await binding({ projectRoot: root, projectId: PROJECT_ID, runId: null });
  const projectRelative = relative(root, projectBound.directory);
  assert.match(projectRelative, /^\.lazyqoder[/\\]dashboard[/\\][0-9a-f]{64}$/);
  await mkdir(join(root, '.lazyqoder/runs/run-iso'), { recursive: true, mode: 0o700 });
  const runBound = await binding({ projectRoot: root, projectId: PROJECT_ID, runId: 'run-iso' });
  assert.match(relative(root, runBound.directory), /^\.lazyqoder[/\\]dashboard[/\\][0-9a-f]{64}$/);
  assert.equal(existsSync(join(root, '.lazybuddy')), false);
  assert.equal(existsSync(join(root, '.lazytrae')), false);
  t.diagnostic(JSON.stringify({ service_store_root: projectRelative }));
});

// Adversarial: a tampered state document and a moved-away state document must
// refuse typed without ever rewriting the shared registry.
test('tampered or missing state documents refuse typed without mutation', async t => {
  const root = await fixture(t, 'tampered');
  assert.equal((await qoder(root, 'init')).code, 0);
  const registryPath = join(root, '.lazyseries/project.json');
  const statePath = join(root, '.lazyqoder/project/state.json');
  const registry = await readFile(registryPath);
  const state = await readFile(statePath);

  // Malformed state: typed parse refusal, registry bytes untouched.
  await writeFile(statePath, '{broken state\n');
  const corrupt = await qoder(root, 'read');
  assert.notEqual(corrupt.code, 0, 'a corrupt state document must fail closed');
  assert.equal(corrupt.stderr.trim(), 'INVALID_JSON');
  assert.equal((await readFile(registryPath)).compare(registry), 0,
    'a corrupt state document must not touch the shared registry');
  await writeFile(statePath, state);

  // Stale store: the state document is moved away; the read refuses typed and
  // recreates nothing.
  const movedAway = join(root, 'state.json.moved');
  await rename(statePath, movedAway);
  const missing = await qoder(root, 'read');
  assert.notEqual(missing.code, 0);
  assert.equal(missing.stderr.trim(), 'PROJECT_NOT_INITIALIZED');
  assert.equal(existsSync(statePath), false, 'the refused read must not recreate a state document');
  await rename(movedAway, statePath);
  assert.equal((await qoder(root, 'read')).code, 0, 'service resumes after the state returns');
  t.diagnostic(JSON.stringify({ corrupt_state: 'INVALID_JSON', missing_state: 'PROJECT_NOT_INITIALIZED',
    registry_bytes_stable: true, no_state_recreated: true }));
});
