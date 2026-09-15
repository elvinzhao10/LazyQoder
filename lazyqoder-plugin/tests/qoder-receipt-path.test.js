'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { prepareProductRoot, promoteRelease, stageRelease } = require('../scripts/lifecycle');

const PLUGIN_ROOT = path.resolve(__dirname, '..');
const SERVERS = ['run-ledger', 'verification', 'status-dashboard', 'context-graph', 'code-intel', 'docs'];

function fixture() {
  const sandbox = fs.mkdtempSync(path.join(fs.realpathSync(os.tmpdir()), 'lazyqoder-private-receipt-'));
  const sourceRoot = path.join(sandbox, 'source');
  const projectRoot = path.join(sandbox, 'project');
  const installRoot = path.join(sandbox, 'install');
  fs.cpSync(PLUGIN_ROOT, path.join(sourceRoot, 'lazyqoder-plugin'), { recursive: true });
  fs.mkdirSync(path.join(sourceRoot, '.qodercli-plugin'), { recursive: true });
  fs.copyFileSync(path.join(PLUGIN_ROOT, '..', '.qodercli-plugin', 'marketplace.json'), path.join(sourceRoot, '.qodercli-plugin', 'marketplace.json'));
  fs.mkdirSync(projectRoot);
  const paths = prepareProductRoot({ installRoot, product: 'LazyQoder' });
  const commitSha = 'c'.repeat(40);
  const staged = stageRelease(paths, { sourceRoot, version: '1.2.3', commitSha });
  const promoted = promoteRelease(paths, {
    ...staged,
    commitSha,
    entrypoint: 'lazyqoder-plugin/scripts/lazyqoder-lifecycle.js',
    manifestRelativePath: 'lazyqoder-plugin/.qodercli-plugin/plugin.json',
    origin: 'https://github.com/elvinzhao10/LazyQoder.git',
    runtimePath: process.execPath,
    version: '1.2.3',
  });
  const releaseRoot = path.join(paths.releases, promoted.releaseId);
  const manifest = path.join(releaseRoot, 'lazyqoder-plugin', '.qoder-plugin', 'plugin.json');
  return { installRoot, paths, projectRoot, releaseRoot, sandbox, manifest };
}

function receipt(f) {
  return {
    schema_version: 1,
    type: 'qoder-marketplace-full-plugin',
    source: {
      route: 'qoder-marketplace',
      release_root: f.releaseRoot,
      manifest: 'lazyqoder-plugin/.qoder-plugin/plugin.json',
      manifest_sha256: crypto.createHash('sha256').update(fs.readFileSync(f.manifest)).digest('hex'),
      plugin: 'lazyqoder',
      version: '1.2.3',
    },
    host: 'qoder',
    build: 'build:current',
    session_id: 'session:current',
    observed_at: new Date().toISOString(),
    capabilities: {
      skill: { id: 'lazy-programming', status: 'loaded' },
      command: { id: 'lazy-status', status: 'loaded' },
      agent: { id: 'lazyqoder-verifier', status: 'loaded' },
      hook: { id: 'SessionStart', status: 'loaded' },
      mcp: Object.fromEntries(SERVERS.map((name) => [name, 'connected'])),
    },
  };
}

test('real CLI refuses a private Qoder IDE receipt reached through a public parent symlink', (t) => {
  // Given: a valid current receipt physically below .qoder and a public parent-directory symlink to it.
  const f = fixture();
  const privateDirectory = path.join(f.sandbox, '.qoder', 'receipts');
  const publicDirectory = path.join(f.sandbox, 'apparently-public');
  fs.mkdirSync(privateDirectory, { recursive: true });
  fs.symlinkSync(privateDirectory, publicDirectory, 'dir');
  fs.writeFileSync(path.join(privateDirectory, 'receipt.json'), `${JSON.stringify(receipt(f))}\n`);
  t.after(() => fs.rmSync(f.sandbox, { recursive: true, force: true }));

  // When: the promoted lifecycle CLI receives only the apparently public spelling.
  const result = spawnSync(process.execPath, [
    f.paths.launcher,
    'status', '--install-root', f.installRoot, '--project', f.projectRoot,
    '--host', 'qoder', '--host-build', 'build:current', '--host-session', 'session:current',
    '--observation-receipt', path.join(publicDirectory, 'receipt.json'), '--json',
  ], { encoding: 'utf8' });
  const output = JSON.parse(result.stdout);

  // Then: canonical private location wins over caller spelling and readiness stays pending.
  assert.notEqual(result.status, 0);
  assert.deepEqual(output.host_readiness, { status: 'pending' });
  assert.equal(output.error.code, 'OBSERVATION_RECEIPT_INVALID');
});
