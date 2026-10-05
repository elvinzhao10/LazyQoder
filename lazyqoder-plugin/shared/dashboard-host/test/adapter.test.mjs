import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer, request } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fixture, host, processCall, queueCommand, runCommand } from './fixture.mjs';
import { qoderAuthority } from '../service-adapter.mjs';

const python = process.env.LAZYQODER_TEST_PYTHON ?? 'python3';
async function context(f, attempt, worker, index) {
  const result = await f.call('producers.mjs', 'context', ['--parent-task-id', 'P', '--task-id', 'A', '--criterion-id', 'C1',
    '--attempt-id', attempt, '--worker-id', worker, '--plan-commands-file', join(f.run, 'commands.json'), '--command-index', String(index), '--python', python]);
  assert.equal(result.code, 0, result.stderr); const path = join(f.run, `${attempt.replace(':', '-')}.json`); await writeFile(path, result.stdout); return path;
}
async function http(origin, path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = options.body === undefined ? undefined : JSON.stringify(options.body);
    const req = request(`${origin}${path}`, { method: options.method ?? (body === undefined ? 'GET' : 'POST'),
      headers: { ...(body === undefined ? {} : { origin, 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) }), ...options.headers }, timeout: 10000 }, response => {
      let text = ''; response.on('data', chunk => { text += chunk; }); response.on('end', () => {
        try { resolve({ status: response.statusCode, value: JSON.parse(text) }); } catch { resolve({ status: response.statusCode, value: text }); }
      });
    });
    req.on('error', reject); req.on('timeout', () => req.destroy(new Error('HTTP_TIMEOUT'))); req.end(body);
  });
}

test('Qoder native edit stays pending until an exact revision is consumed and distinct verifier proves it', async () => {
  const f = await fixture();
  try {
    const before = await qoderAuthority.read({ projectRoot: f.root, projectId: 'project:qoder', runId: 'probe', python });
    const edited = runCommand('amend_criterion', before.revision, { criterion_id: 'C1', expected_version: 1, requirement: 'Qoder adopted edit' }, 'A', 'edit:qoder');
    const saved = await f.call('commands.mjs', 'command', ['--python', python], JSON.stringify(edited));
    assert.equal(saved.code, 0, saved.stderr); assert.equal(JSON.parse(saved.stdout).status, 'pending_agent');
    let state = JSON.parse(await readFile(f.statePath, 'utf8')); assert.equal(state.acknowledgements[0].status, 'pending_agent');
    const executorContext = await context(f, 'executor:qoder', 'worker:qoder-executor', 0);
    const executed = await f.call('producers.mjs', 'execute', ['--context-file', executorContext,
      '--artifact-path', '.lazyqoder/runs/probe/actual.txt', '--python', python]);
    assert.equal(executed.code, 0, executed.stderr || executed.stdout);
    state = JSON.parse(await readFile(f.statePath, 'utf8')); assert.equal(state.acknowledgements[0].status, 'applied');
    const verifierContext = await context(f, 'verifier:qoder', 'worker:qoder-verifier', 1);
    const verified = await f.call('producers.mjs', 'verify', ['--context-file', verifierContext,
      '--artifact-path', '.lazyqoder/runs/probe/actual.txt', '--executor-id', 'worker:qoder-executor',
      '--executor-attempt-id', 'executor:qoder', '--python', python]);
    assert.equal(verified.code, 0, verified.stderr || verified.stdout);
    const input = await qoderAuthority.read({ projectRoot: f.root, projectId: 'project:qoder', runId: 'probe', python });
    const snapshot = await qoderAuthority.project(input); const task = snapshot.tasks.find(item => item.id === 'A');
    assert.equal(task.progress.verified, 1); assert.equal(task.criteria[0].requirement, 'Qoder adopted edit');
    assert.deepEqual(task.attempts.map(item => item.worker_id), ['worker:qoder-executor', 'worker:qoder-verifier']);
    assert.notEqual(JSON.parse(await readFile(executorContext, 'utf8')).worker_id, JSON.parse(await readFile(verifierContext, 'utf8')).worker_id);
  } finally { await f.cleanup(); }
});

test('Qoder run conflicts and cycles reject while queue edits persist without execution', async () => {
  const f = await fixture();
  try {
    let input = await qoderAuthority.read({ projectRoot: f.root, projectId: 'project:qoder', runId: 'probe', python });
    const first = await f.call('commands.mjs', 'command', ['--python', python], JSON.stringify(runCommand('add_dependency', input.revision, { prerequisite_id: 'P' })));
    assert.equal(first.code, 0, first.stderr); input = await qoderAuthority.read({ projectRoot: f.root, projectId: 'project:qoder', runId: 'probe', python });
    const cycle = await f.call('commands.mjs', 'command', ['--python', python], JSON.stringify(runCommand('add_dependency', input.revision, { prerequisite_id: 'A' }, 'P')));
    assert.notEqual(cycle.code, 0); assert.match(cycle.stderr, /CYCLE/);
    const stale = await f.call('commands.mjs', 'command', ['--python', python], JSON.stringify(runCommand('amend_task', 1, { priority: 9 }, 'A', 'stale:qoder')));
    assert.equal(JSON.parse(stale.stdout).status, 'conflict');
    const plan = { id: 'plan:qoder', project_id: 'project:qoder', title: 'Qoder queued', priority: 1, readiness: 'draft', prerequisites: [], decision_id: null, revision: 0 };
    for (const command of [queueCommand('create_queued_plan', 0, { plan }, 'plan:qoder'),
      queueCommand('amend_queued_plan', 1, { title: 'Chosen Qoder title', priority: 7, readiness: 'ready' }, 'plan:qoder'),
      queueCommand('reorder_queued_plan', 2, { plan_ids: ['plan:qoder'] }, 'queue')]) {
      const result = await f.call('commands.mjs', 'command', ['--python', python], JSON.stringify(command));
      assert.equal(result.code, 0, result.stderr); assert.equal(JSON.parse(result.stdout).status, 'saved');
    }
    input = await qoderAuthority.read({ projectRoot: f.root, projectId: 'project:qoder', runId: 'probe', python });
    assert.equal(input.queue[0].title, 'Chosen Qoder title'); assert.equal(input.queue_revision, 3);
    assert.equal((await readFile(f.statePath, 'utf8')).includes('plan:qoder'), false);
  } finally { await f.cleanup(); }
});

test('Qoder owned lifecycle preserves origin and refuses a foreign listener', async () => {
  const f = await fixture(); const cli = join(host, 'cli.mjs'); const binding = f.binding.slice(0, 6); let live;
  const call = action => processCall([process.execPath, cli, action, ...binding, '--python', python, ...(live?.identity.port && action === 'start' ? ['--port', String(live.identity.port)] : [])]);
  try {
    const opened = await call('open'); assert.equal(opened.code, 0, opened.stderr); live = JSON.parse(opened.stdout);
    const credential = await readFile(live.credential_file, 'utf8');
    const session = await http(live.url, '/api/session', { body: {}, headers: { 'x-dashboard-bootstrap': credential } });
    const snapshot = await http(live.url, '/api/snapshot', { headers: { authorization: `Bearer ${session.value.token}` } });
    assert.equal(snapshot.status, 200); assert.equal(snapshot.value.snapshot.project_id, 'project:qoder');
    const port = live.identity.port; assert.equal((await call('status')).code, 0); assert.equal((await call('stop')).code, 0);
    const foreign = createServer((_request, response) => response.end('foreign'));
    await new Promise((resolve, reject) => { foreign.once('error', reject); foreign.listen(port, '127.0.0.1', resolve); });
    try {
      assert.equal((await call('start')).code, 65); const response = await http(`http://127.0.0.1:${port}`, '/'); assert.equal(response.value, 'foreign');
    } finally { await new Promise(resolve => foreign.close(resolve)); }
    const restarted = await call('start'); assert.equal(restarted.code, 0, restarted.stderr); assert.equal(JSON.parse(restarted.stdout).identity.port, port);
  } finally {
    await processCall([process.execPath, cli, 'stop', ...binding, '--python', python]); await f.cleanup();
  }
});
