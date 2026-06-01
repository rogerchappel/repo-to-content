#!/usr/bin/env bash
set -euo pipefail
rm -rf tmp-content
node src/cli.js fixtures/sample-repo --format posts --out tmp-content >/dev/null
test -f tmp-content/posts.md
rm -rf tmp-content
echo smoke ok
