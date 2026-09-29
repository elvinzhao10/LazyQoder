'use strict';

const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const plugin = path.resolve(__dirname, '..');
const generator = path.join(plugin, 'scripts', 'sync-agent-mirrors.js');

test('agent mirrors are generated from canonical definitions and drift is detected', (t) => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'lazyqoder-agent-mirror-'));
  t.after(() => fs.rmSync(fixture, { recursive: true, force: true }));
  fs.cpSync(path.join(plugin, 'agents'), path.join(fixture, 'agents'), { recursive: true });
  fs.cpSync(path.join(plugin, '.qoder', 'agents'), path.join(fixture, '.qoder', 'agents'), { recursive: true });
  const run = (...args) => spawnSync(process.execPath, [generator, '--root', fixture, ...args], { encoding: 'utf8' });
  assert.equal(run().status, 0);
  const agent = path.join(fixture, 'agents', 'lazyqoder-verifier.md');
  fs.appendFileSync(agent, '\nCanonical change\n');
  assert.equal(run().status, 1);
  assert.equal(run('--write').status, 0);
  assert.equal(run().status, 0);
  assert.equal(fs.readFileSync(agent, 'utf8'), fs.readFileSync(path.join(fixture, '.qoder', 'agents', 'lazyqoder-verifier.md'), 'utf8'));
});

test('advertised skill and command counts match canonical files', () => {
  const skills = fs.readdirSync(path.join(plugin, 'skills')).filter((name) => fs.existsSync(path.join(plugin, 'skills', name, 'SKILL.md'))).length;
  const commands = fs.readdirSync(path.join(plugin, 'commands')).filter((name) => name.endsWith('.md')).length;
  const readme = fs.readFileSync(path.join(plugin, 'README.md'), 'utf8');
  assert.match(readme, new RegExp(`\\| \`skills/\` \\| ${skills} portable workflow skills \\|`));
  assert.match(readme, new RegExp(`\\| \`commands/\` \\| ${commands} current slash-command workflows \\|`));
});
