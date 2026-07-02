#!/usr/bin/env node

import { execFileSync } from "node:child_process";

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

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8",
  stdio: ["ignore", "pipe", "pipe"]
});

const [pack] = JSON.parse(output);
const packedFiles = new Set(pack.files.map((file) => file.path));
const missing = requiredFiles.filter((file) => !packedFiles.has(file));

if (missing.length > 0) {
  console.error(`package smoke failed: missing ${missing.join(", ")}`);
  process.exit(1);
}

console.log(
  `package smoke ok: ${pack.filename} includes ${pack.files.length} files`
);
