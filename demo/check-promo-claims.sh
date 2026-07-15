#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

out_dir="${TMPDIR:-/tmp}/repo-to-content-promo-claims"
rm -rf "$out_dir"
mkdir -p "$out_dir"

node src/cli.js examples/sample-content-repo \
  --format posts \
  --format video-script \
  --format launch-notes \
  --out "$out_dir"

for artifact in posts.md launch-notes.md; do
  echo "Checking $artifact"
  node src/cli.js --check-claims "$out_dir/$artifact" "$out_dir/evidence.json"
done

test -s "$out_dir/evidence.json"
test -s "$out_dir/video-script.md"
echo "Claim-checked promo artifacts: $out_dir"
