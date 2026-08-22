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
console.log('release readiness files present');
