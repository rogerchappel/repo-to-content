import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const validator = new URL('../scripts/validate.js', import.meta.url);
const workflowPath = path.resolve('.github/workflows/ci.yml');

test('release check enforces CI coverage of the engine boundary', (t) => {
  const original = fs.readFileSync(workflowPath, 'utf8');
  const fixtureDir = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-to-content-ci-contract-'));
  t.after(() => fs.rmSync(fixtureDir, { recursive: true, force: true }));
  const fixtureWorkflow = path.join(fixtureDir, '.github/workflows/ci.yml');
  fs.mkdirSync(path.dirname(fixtureWorkflow), { recursive: true });
  const validatorSource = fs.readFileSync(new URL('../scripts/validate.js', import.meta.url), 'utf8');
  const fixtureValidator = path.join(fixtureDir, 'scripts/validate.js');
  fs.mkdirSync(path.dirname(fixtureValidator), { recursive: true });
  fs.writeFileSync(fixtureValidator, validatorSource.replace(
    "fs.readFileSync('.github/workflows/ci.yml', 'utf8')",
    `fs.readFileSync(${JSON.stringify(fixtureWorkflow)}, 'utf8')`,
  ));
  const run = (workflow) => {
    fs.writeFileSync(fixtureWorkflow, workflow);
    return spawnSync(process.execPath, [fixtureValidator], { cwd: process.cwd(), encoding: 'utf8' });
  };

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
  assert.equal(fs.readFileSync(workflowPath, 'utf8'), original, 'tracked workflow must remain unchanged');
});
