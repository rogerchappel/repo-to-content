import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const validator = new URL('../scripts/validate.js', import.meta.url);
const workflowPath = '.github/workflows/ci.yml';

test('release check enforces CI coverage of the engine boundary', () => {
  const original = fs.readFileSync(workflowPath, 'utf8');
  const run = (workflow) => {
    fs.writeFileSync(workflowPath, workflow);
    return spawnSync(process.execPath, [validator.pathname], { encoding: 'utf8' });
  };
  try {
    const valid = run(original);
    assert.equal(valid.status, 0, valid.stderr || valid.stdout);

    const withoutNode24 = original.replace(/node-version: \['22', '24'\]/, "node-version: ['22']");
    assert.notEqual(withoutNode24, original, 'expected to find the Node matrix');
    const missingBoundary = run(withoutNode24);
    assert.notEqual(missingBoundary.status, 0);
    assert.match(missingBoundary.stderr, /must test Node 24/);

    const withNode25 = original.replace("node-version: ['22', '24']", "node-version: ['22', '24', '25']");
    const unsupportedRunner = run(withNode25);
    assert.notEqual(unsupportedRunner.status, 0);
    assert.match(unsupportedRunner.stderr, /outside package engine range/);
  } finally {
    fs.writeFileSync(workflowPath, original);
  }
});
