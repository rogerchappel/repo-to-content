import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
const FORMATS = ['posts','video-script','demo-outline','launch-notes','changelog'];
export function inspectRepo(repoPath) {
  const files = {};
  const repoRoot = resolveRepoDirectory(repoPath);
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
function resolveRepoDirectory(repoPath) {
  let repoRoot;
  try { repoRoot = fs.realpathSync(repoPath); }
  catch (err) {
    if (err.code === 'ENOENT') throw new Error(`Repository target does not exist: ${repoPath}`);
    throw err;
  }
  if (!fs.statSync(repoRoot).isDirectory()) throw new Error(`Repository target is not a directory: ${repoPath}`);
  return repoRoot;
}
function readContainedFile(repoRoot, name) {
  const candidate = path.join(repoRoot, name);
  let resolved;
  try { resolved = fs.realpathSync(candidate); } catch (err) { if (err.code === 'ENOENT') return; throw err; }
  const relative = path.relative(repoRoot, resolved);
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) return;
  return fs.readFileSync(resolved, 'utf8');
}
function safeGit(repoPath) { try { return execFileSync('git',['log','--oneline','-5'],{cwd:repoPath,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim().split('\n').filter(Boolean); } catch { return []; } }
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
  const structuralLabels = new Set(['Evidence-backed capabilities:', 'Recent commits:']);
  for (const line of markdown.split(/\n/)) {
    if (/^\s*(?:#{1,6}|[-+*]|\d+[.)])?\s*$/.test(line) || /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) continue;
    let normalized = line
      .replace(/^\s*#{1,6}\s*/, '')
      .replace(/^\s*(?:[-+*]|\d+[.)])\s+/, '')
      .trim();
    if (structuralLabels.has(normalized)) continue;
    if (normalized.startsWith('Launch notes:')) normalized = normalized.slice('Launch notes:'.length).trim();
    if (!normalized) continue;
    if (!evidence.some(e => normalized.includes(e.claim))) missing.push(normalized);
  }
  return { ok: missing.length === 0, missing };
}
export { FORMATS };
