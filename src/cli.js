#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { generateContent, checkClaims, FORMATS } from './index.js';
const args = process.argv.slice(2); const cmdOrRepo=args.shift();
if (!cmdOrRepo || cmdOrRepo === '--help') {
  console.log('Usage: repo-to-content <repo> [--format posts] [--out dir]\n       repo-to-content --check-claims content.md evidence.json');
  process.exit(cmdOrRepo ? 0 : 1);
}
try {
  if (cmdOrRepo === '--check-claims') {
    if (args.length !== 2) throw new Error('--check-claims requires a content file and an evidence file');
    const markdown = fs.readFileSync(args[0],'utf8'); const evidence = JSON.parse(fs.readFileSync(args[1],'utf8')).evidence || [];
    const result = checkClaims(markdown, evidence); console.log(JSON.stringify(result,null,2)); process.exit(result.ok ? 0 : 2);
  }
  if (cmdOrRepo.startsWith('--')) throw new Error(`Unknown option: ${cmdOrRepo}`);
  const repo = cmdOrRepo;
  const { formats, out } = parseOptions(args);
  const result = generateContent(repo, formats.length ? formats : undefined);
  if (out) { fs.mkdirSync(out,{recursive:true}); for (const [name,body] of Object.entries(result.outputs)) fs.writeFileSync(path.join(out, name.endsWith('.json')?name:name+'.md'), body); }
  else console.log(JSON.stringify(result.outputs,null,2));
} catch (err) { console.error(err.message); process.exit(1); }

function parseOptions(options) {
  const formats = [];
  let out;
  for (let index = 0; index < options.length; index += 1) {
    const option = options[index];
    if (option !== '--format' && option !== '--out') throw new Error(`Unknown option: ${option}`);
    const value = options[++index];
    if (!value || value.startsWith('--')) throw new Error(`Missing value for ${option}`);
    if (option === '--format') {
      if (!FORMATS.includes(value)) throw new Error(`Unsupported format: ${value}`);
      formats.push(value);
    } else {
      if (out !== undefined) throw new Error('--out may only be specified once');
      out = value;
    }
  }
  return { formats, out };
}
