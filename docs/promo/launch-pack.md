# Repo To Content Launch Pack

## One-line description

`repo-to-content` generates reviewable launch-content drafts from local
repository facts.

## Demo flow

1. Show `fixtures/sample-repo/README.md` and `fixtures/sample-repo/package.json`
   as the source evidence.
2. Run `node src/cli.js fixtures/sample-repo --format posts --format
   launch-notes --format video-script --out /tmp/repo-to-content-demo`.
3. Open `posts.md`, `launch-notes.md`, and `video-script.md`.
4. Open `evidence.json` and point to the collected source facts.
5. Run `node src/cli.js --check-claims /tmp/repo-to-content-demo/posts.md
   /tmp/repo-to-content-demo/evidence.json`.

## Social hooks

- Draft launch posts from repo facts first, then review them before publishing.
- `repo-to-content` keeps promotion copy tied to README, package metadata, and
  recent git history.
- The useful part is the claim check: generated copy can be compared against
  evidence before it leaves the repo.

## Guardrails

- Outputs are drafts, not auto-published social posts.
- Human review is required before using generated content externally.
- V1 uses deterministic local parsing with intentionally small fixtures.
