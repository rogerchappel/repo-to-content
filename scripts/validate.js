#!/usr/bin/env node
import fs from 'fs';
const required = ['README.md','SKILL.md','docs/PRD.md','docs/TASKS.md','docs/ORCHESTRATION.md','package.json','package-lock.json'];
const missing = required.filter(file => !fs.existsSync(file));
if (missing.length) { console.error('Missing required files: ' + missing.join(', ')); process.exit(1); }

const workflow = fs.readFileSync('.github/workflows/ci.yml', 'utf8');
if (!/^\s*- run: npm ci\s*$/m.test(workflow)) {
  console.error('CI must install dependencies with npm ci');
  process.exit(1);
}
const nodeEndpoints = [...workflow.matchAll(/^\s*node-version:.*\[(.*?)\]\s*$/gm)]
  .flatMap((match) => [...match[1].matchAll(/['"]?(\d+)['"]?/g)].map((version) => version[1]));
for (const required of ['22', '24']) {
  if (!nodeEndpoints.includes(required)) {
    console.error(`CI must test Node ${required}`);
    process.exit(1);
  }
}
console.log('release readiness files present');
