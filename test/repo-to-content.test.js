import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execFileSync, spawnSync } from 'child_process';
import { inspectRepo, generateContent, checkClaims } from '../src/index.js';
const repo = 'examples/sample-content-repo';
test('inspects README and package metadata', () => { const facts=inspectRepo(repo); assert.equal(facts.name,'sample-tool'); assert.ok(facts.bullets.length >= 2); });
test('generates requested formats plus evidence map', () => { const r=generateContent(repo,['posts','launch-notes']); assert.match(r.outputs.posts,/sample-tool/); assert.ok(r.outputs['evidence.json']); });
test('claim checker accepts evidence-backed lines', () => { const r=generateContent(repo,['launch-notes']); const evidence=JSON.parse(r.outputs['evidence.json']).evidence; assert.equal(checkClaims(r.outputs['launch-notes'], evidence).ok, true); });
test('claim checker rejects unsupported copy', () => { const result=checkClaims('Fastest platform in the world with SOC2 compliance', []); assert.equal(result.ok,false); });
test('cli writes artifacts', () => { fs.rmSync('tmp-content',{recursive:true,force:true}); execFileSync('node',['src/cli.js',repo,'--format','posts','--out','tmp-content'],{encoding:'utf8'}); assert.ok(fs.existsSync('tmp-content/posts.md')); fs.rmSync('tmp-content',{recursive:true,force:true}); });
test('cli check-claims exits nonzero for unsupported claims', () => { fs.writeFileSync('tmp-claim.md','Unverified enterprise claim'); fs.writeFileSync('tmp-evidence.json',JSON.stringify({evidence:[]})); const r=spawnSync('node',['src/cli.js','--check-claims','tmp-claim.md','tmp-evidence.json'],{encoding:'utf8'}); assert.equal(r.status,2); fs.rmSync('tmp-claim.md'); fs.rmSync('tmp-evidence.json'); });
test('ignores scanned metadata symlinked outside the repository', () => {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-to-content-'));
  const repoPath = path.join(parent, 'repo');
  const externalPath = path.join(parent, 'external');
  fs.mkdirSync(repoPath);
  fs.mkdirSync(externalPath);
  const metadata = {
    'README.md': '# Private\n- PRIVATE_EXTERNAL_README',
    'package.json': JSON.stringify({ name: 'PRIVATE_EXTERNAL_PACKAGE', description: 'PRIVATE_EXTERNAL_DESCRIPTION' }),
    'CHANGELOG.md': 'PRIVATE_EXTERNAL_CHANGELOG'
  };
  try {
    for (const [name, contents] of Object.entries(metadata)) {
      const externalFile = path.join(externalPath, name);
      fs.writeFileSync(externalFile, contents);
      fs.symlinkSync(externalFile, path.join(repoPath, name));
    }
    const result = generateContent(repoPath);
    const serialized = JSON.stringify(result);
    assert.deepEqual(result.facts.files, []);
    assert.doesNotMatch(serialized, /PRIVATE_EXTERNAL_/);
  } finally {
    fs.rmSync(parent, { recursive: true, force: true });
  }
});
