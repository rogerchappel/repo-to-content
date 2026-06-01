#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { generateContent, checkClaims } from './index.js';
const args = process.argv.slice(2); const cmdOrRepo=args.shift();
if (!cmdOrRepo || cmdOrRepo === '--help') { console.log('Usage: repo-to-content <repo> [--format posts] [--out dir]
       repo-to-content --check-claims content.md evidence.json'); process.exit(cmdOrRepo ? 0 : 1); }
try {
  if (cmdOrRepo === '--check-claims') {
    const markdown = fs.readFileSync(args[0],'utf8'); const evidence = JSON.parse(fs.readFileSync(args[1],'utf8')).evidence || [];
    const result = checkClaims(markdown, evidence); console.log(JSON.stringify(result,null,2)); process.exit(result.ok ? 0 : 2);
  }
  const repo = cmdOrRepo; const formats = args.flatMap((a,i)=>a==='--format'?[args[i+1]]:[]).filter(Boolean); const out = args[args.indexOf('--out')+1];
  const result = generateContent(repo, formats.length ? formats : undefined);
  if (out) { fs.mkdirSync(out,{recursive:true}); for (const [name,body] of Object.entries(result.outputs)) fs.writeFileSync(path.join(out, name.endsWith('.json')?name:name+'.md'), body); }
  else console.log(JSON.stringify(result.outputs,null,2));
} catch (err) { console.error(err.message); process.exit(1); }
