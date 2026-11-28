#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const requiredFiles = [
  "src/cli.js",
  "src/index.js",
  "demo/run-fixture-content.sh",
  "examples/content-sweep-demo.md",
  "examples/demo-output-manifest.md",
  "examples/sample-content-repo/README.md",
  "fixtures/sample-repo/README.md",
  "docs/API.md",
  "docs/SAFETY.md",
  "docs/tutorials/evidence-backed-launch-pack.md",
  "docs/promo/launch-pack.md",
  "SKILL.md",
  "README.md",
  "CHANGELOG.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md"
];

const temp = mkdtempSync(join(tmpdir(), "repo-to-content-package-smoke-"));
try {
  const output = execFileSync("npm", ["pack", "--json", "--pack-destination", temp], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
  const [pack] = JSON.parse(output);
  const missing = requiredFiles.filter((file) => !pack.files.some((entry) => entry.path === file));

  if (missing.length > 0) {
    throw new Error(`missing ${missing.join(", ")}`);
  }

  const archive = join(temp, pack.filename);
  execFileSync("npm", ["install", "--prefix", temp, "--ignore-scripts", "--no-audit", "--no-fund", archive], {
    stdio: "ignore"
  });
  execFileSync(join(temp, "node_modules", ".bin", "repo-to-content"), ["--help"], {
    stdio: "ignore"
  });

  console.log(`package smoke ok: installed ${pack.filename} and ran repo-to-content --help`);
} catch (error) {
  console.error(`package smoke failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(temp, { recursive: true, force: true });
}
