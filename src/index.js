import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
const FORMATS = ['posts','video-script','demo-outline','launch-notes','changelog'];
export function inspectRepo(repoPath) {
  const files = {};
  const repoRoot = fs.realpathSync(repoPath);
  for (const name of ['README.md','package.json','CHANGELOG.md']) {
    const contents = readContainedFile(repoRoot, name);
    if (contents !== undefined) files[name] = contents;
  }
  const gitLog = safeGit(repoPath);
  const packageJson = files['package.json'] ? JSON.parse(files['package.json']) : {};
  const readmeTitle = (files['README.md'] || '').match(/^#\s+(.+)$/m)?.[1] || packageJson.name || path.basename(repoPath);
  const bullets = [...(files['README.md'] || '').matchAll(/^-\s+(.+)$/gm)].slice(0,5).map(m=>m[1]);
  return { name: packageJson.name || readmeTitle, description: packageJson.description || bullets[0] || '', bullets, gitLog, files: Object.keys(files) };
}
function readContainedFile(repoRoot, name) {
  const candidate = path.join(repoRoot, name);
  let resolved;
  try { resolved = fs.realpathSync(candidate); } catch (err) { if (err.code === 'ENOENT') return; throw err; }
  const relative = path.relative(repoRoot, resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return;
  return fs.readFileSync(resolved, 'utf8');
}
function safeGit(repoPath) { try { return execFileSync('git',['log','--oneline','-5'],{cwd:repoPath,encoding:'utf8'}).trim().split('\n').filter(Boolean); } catch { return []; } }
export function generateContent(repoPath, formats=FORMATS) {
  const facts = inspectRepo(repoPath); const evidence = [
    {claim:facts.name, source:'package.json or README.md'},
    {claim:facts.description, source:'package.json'},
    ...facts.bullets.map(b=>({claim:b, source:'README.md'})),
    ...facts.gitLog.map(g=>({claim:g, source:'git log'}))
  ].filter(item => item.claim);
  const outputs = {};
  if (formats.includes('posts')) outputs.posts = [`Built around ${facts.name}: ${facts.description}`, `What it does: ${facts.bullets.slice(0,3).join('; ')}`].join('\n');
  if (formats.includes('video-script')) outputs['video-script'] = [`Hook: Here is ${facts.name}.`, `Show: open the README and run the smoke command.`, `Proof: cite ${facts.files.join(', ')}.`].join('\n');
  if (formats.includes('demo-outline')) outputs['demo-outline'] = ['Install locally','Run fixture smoke','Show generated output','Call out limitations'].join('\n');
  if (formats.includes('launch-notes')) outputs['launch-notes'] = `# Launch notes: ${facts.name}\n\n${facts.description}\n\nEvidence-backed capabilities:\n${facts.bullets.map(b=>'- '+b).join('\n')}\n`;
  if (formats.includes('changelog')) outputs.changelog = ['Recent commits:', ...facts.gitLog.map(g=>'- '+g)].join('\n');
  outputs['evidence.json'] = JSON.stringify({ repo: repoPath, evidence }, null, 2);
  return { facts, outputs };
}
export function checkClaims(markdown, evidence) {
  const missing = [];
  const headings = new Set(['Launch notes:', 'Evidence-backed capabilities:', 'Recent commits:']);
  for (const line of markdown.split(/\n+/).filter(Boolean)) {
    const normalized = line.replace(/^[-# ]+/, '').trim();
    if ([...headings].some(prefix => normalized.startsWith(prefix))) continue;
    if (normalized.length > 20 && !evidence.some(e => normalized.includes(e.claim) || e.claim.includes(normalized))) missing.push(normalized);
  }
  return { ok: missing.length === 0, missing };
}
export { FORMATS };
