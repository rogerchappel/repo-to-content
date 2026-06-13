#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

out_dir="${TMPDIR:-/tmp}/repo-to-content-demo"
rm -rf "$out_dir"
mkdir -p "$out_dir"

node src/cli.js examples/sample-content-repo --format posts --format video-script --format launch-notes --out "$out_dir"
node src/cli.js --check-claims "$out_dir/launch-notes.md" "$out_dir/evidence.json"

test -s "$out_dir/posts.md"
test -s "$out_dir/video-script.md"
test -s "$out_dir/launch-notes.md"
test -s "$out_dir/evidence.json"

echo "Generated content: $out_dir"
