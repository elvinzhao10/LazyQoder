#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const write = args.includes('--write');
const rootIndex = args.indexOf('--root');
if (args.some((arg) => !['--write', '--root'].includes(arg) && (rootIndex < 0 || args[rootIndex + 1] !== arg))
  || (rootIndex >= 0 && !args[rootIndex + 1])
  || args.length !== (write ? 1 : 0) + (rootIndex >= 0 ? 2 : 0)) {
  process.stderr.write('Usage: node scripts/sync-agent-mirrors.js [--write] [--root absolute-path]\n');
  process.exit(2);
}
const pluginRoot = rootIndex >= 0 ? path.resolve(args[rootIndex + 1]) : path.resolve(__dirname, '..');
const source = path.join(pluginRoot, 'agents');
const mirror = path.join(pluginRoot, '.qoder', 'agents');

const canonical = fs.readdirSync(source).filter((name) => name.endsWith('.md')).sort();
const mirrored = fs.readdirSync(mirror).filter((name) => name.endsWith('.md')).sort();
if (canonical.length === 0 || JSON.stringify(canonical) !== JSON.stringify(mirrored)) {
  process.stderr.write('Agent mirror inventory differs from canonical definitions.\n');
  process.exit(1);
}

let drift = 0;
for (const name of canonical) {
  const expected = fs.readFileSync(path.join(source, name));
  const target = path.join(mirror, name);
  if (expected.equals(fs.readFileSync(target))) continue;
  drift += 1;
  if (write) fs.writeFileSync(target, expected);
  else process.stderr.write(`Agent mirror drift: ${name}\n`);
}
process.stdout.write(`Agent mirrors: ${canonical.length} definitions, ${drift} ${write ? 'updated' : 'different'}\n`);
if (drift && !write) process.exitCode = 1;
