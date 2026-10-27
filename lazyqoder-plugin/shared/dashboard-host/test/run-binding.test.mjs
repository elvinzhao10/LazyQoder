import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fixture, plugin, processCall } from './fixture.mjs';
import { capture, evidence } from '../service-snapshot.mjs';
import { qoderAuthority } from '../service-adapter.mjs';

test('snapshot, evidence and telemetry stay bound to the requested run', async () => {
  const f = await fixture();
  const options = { projectRoot: f.root, projectId: 'project:qoder', runId: 'probe' };
  try {
    assert.equal((await f.call('project.mjs', 'init', [])).code, 0);
    const state = JSON.parse(await readFile(f.statePath, 'utf8'));
    const reference = '.lazyqoder/runs/probe/proof.txt';
    state.tasks[0].evidence = [reference];
    await writeFile(f.statePath, JSON.stringify(state));
    await writeFile(join(f.run, 'proof.txt'), 'probe evidence');
    const newer = await processCall(['bash', join(plugin, 'scripts/state/create-run.sh'), 'newer', 'Newer run'], '', { CWD: f.root });
    assert.equal(newer.code, 0, newer.stderr);
    const snapshot = await capture(options);
    assert.equal(snapshot.snapshot.run_id, 'probe');
    const item = snapshot.evidence.find(entry => entry.path === reference);
    assert.ok(item);
    assert.equal((await evidence(options, item.id)).toString(), 'probe evidence');
    const telemetry = await qoderAuthority.readProjectTelemetry(options, 'test:binding');
    assert.equal(telemetry.run_id, 'probe');

    state.run_id = 'newer';
    await writeFile(f.statePath, JSON.stringify(state));
    await assert.rejects(capture(options), /run\/project identity mismatch/);
    await assert.rejects(evidence(options, item.id), /run\/project identity mismatch/);
    const rejected = await qoderAuthority.readProjectTelemetry(options, 'test:binding');
    assert.equal(rejected.run_id, null);
    assert.equal(rejected.monitor.available, false);
    assert.ok(rejected.problems.some(problem => problem.id === 'run-observation'));
  } finally { await f.cleanup(); }
});
