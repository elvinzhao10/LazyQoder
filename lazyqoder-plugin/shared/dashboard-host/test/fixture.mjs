import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const plugin = fileURLToPath(new URL('../../../', import.meta.url));
export const host = join(plugin, 'shared/dashboard-host');
export const digest = value => createHash('sha256').update(value).digest('hex');

export function processCall(argv, input = '', environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(argv[0], argv.slice(1), { env: { ...process.env, ...environment }, stdio: ['pipe', 'pipe', 'pipe'] });
    const timer = setTimeout(() => child.kill('SIGKILL'), 30000);
    let stdout = ''; let stderr = '';
    child.stdout.on('data', chunk => { stdout += chunk; }); child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject); child.stdin.on('error', error => { if (error.code !== 'EPIPE') reject(error); });
    child.on('close', (code, signal) => { clearTimeout(timer); resolve({ argv, code, signal, stdout, stderr }); });
    child.stdin.end(input);
  });
}

export async function fixture() {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'lazyqoder-dashboard-')));
  const gitEnv = { GIT_CONFIG_NOSYSTEM: '1', HOME: root };
  for (const args of [['init', '-q'], ['config', 'user.name', 'Qoder Dashboard QA'], ['config', 'user.email', 'qoder@example.invalid']]) {
    const result = await processCall(['git', '-C', root, ...args], '', gitEnv);
    if (result.code) throw new Error(result.stderr);
  }
  await writeFile(join(root, '.gitignore'), '.lazyqoder/\n');
  await processCall(['git', '-C', root, 'add', '.gitignore'], '', gitEnv);
  await processCall(['git', '-C', root, 'commit', '-qm', 'fixture'], '', gitEnv);
  const created = await processCall(['bash', join(plugin, 'scripts/state/create-run.sh'), 'probe', 'Qoder dashboard probe'], '', { CWD: root });
  if (created.code) throw new Error(created.stderr);
  const run = join(root, '.lazyqoder/runs/probe'); const head = (await processCall(['git', '-C', root, 'rev-parse', 'HEAD'])).stdout.trim();
  const plan = '# Plan\n- [x] [C1] Original Qoder criterion\n';
  const artifact = join(run, 'actual.txt'); const workload = join(host, 'test/workload.mjs');
  const commands = [[process.execPath, workload, 'write', artifact, 'Qoder adopted edit'], [process.execPath, workload, 'verify', artifact, 'Qoder adopted edit']];
  const commandsBytes = `${JSON.stringify(commands)}\n`; const statePath = join(run, 'state.json');
  const state = JSON.parse(await readFile(statePath, 'utf8'));
  state.status = 'active'; state.plan_reference = '.lazyqoder/runs/probe/plan.md'; state.plan_revision = 1;
  state._approved_plan_sha256 = digest(plan); state.dashboard_project_id = 'project:qoder';
  state.tasks = [{ id: 'P', title: 'Qoder parent', status: 'running', depends_on: [], execution_authority: {
    repo_head: head, criterion_ids: ['C1'], plan_reference: state.plan_reference, plan_sha256: digest(plan),
    plan_commands_path: '.lazyqoder/runs/probe/commands.json', plan_commands_sha256: digest(commandsBytes),
  } }, { id: 'A', title: 'Qoder child', status: 'queued', depends_on: [], criteria: [{ id: 'C1', task_id: 'A', version: 1,
    requirement: 'Original Qoder criterion', applicability: 'required', verification: 'unverified', scenarios: [], result_ids: [], history: [] }] }];
  await mkdir(join(run, 'checkpoints'), { recursive: true });
  await Promise.all([writeFile(join(run, 'plan.md'), plan), writeFile(join(run, 'checkpoints/plan-revision.md'), plan),
    writeFile(join(run, 'commands.json'), commandsBytes), writeFile(statePath, JSON.stringify(state))]);
  const binding = ['--project-root', root, '--project-id', 'project:qoder', '--run-id', 'probe', '--actor', 'test:qoder'];
  const call = (entry, action, args = [], input = '') => processCall([process.execPath, join(host, entry), action, ...binding, ...args], input);
  return { root, run, statePath, artifact, binding, call, cleanup: () => rm(root, { recursive: true }) };
}

export const runCommand = (operation, revision, payload, target = 'A', id = `${operation}:${revision}`) => ({
  schema_version: 1, command_id: id, target: { project_id: 'project:qoder', run_id: 'probe', id: target }, expected_revision: revision, operation, payload,
});

export const queueCommand = (operation, revision, payload, target, id = `${operation}:${revision}`) => ({
  schema_version: 1, command_id: id, target: { project_id: 'project:qoder', run_id: null, id: target }, expected_revision: revision, operation, payload,
});
