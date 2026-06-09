# Content Sweep Demo

This demo generates promotion-support drafts from the checked-in
`fixtures/sample-repo` project, then validates one generated file against the
evidence JSON.

## Setup

```sh
npm install
rm -rf /tmp/repo-to-content-demo
```

## Run the demo

Generate posts, launch notes, a video script, and evidence:

```sh
node src/cli.js fixtures/sample-repo --format posts --format launch-notes --format video-script --out /tmp/repo-to-content-demo
```

Inspect the generated files:

```sh
ls /tmp/repo-to-content-demo
sed -n '1,80p' /tmp/repo-to-content-demo/posts.md
sed -n '1,80p' /tmp/repo-to-content-demo/launch-notes.md
```

Check claims in the generated post against the evidence file:

```sh
node src/cli.js --check-claims /tmp/repo-to-content-demo/posts.md /tmp/repo-to-content-demo/evidence.json
```

## Expected proof points

- Drafts are generated from local repository files.
- `evidence.json` records the package, README, and git-log facts used by the
  outputs.
- `--check-claims` returns `ok: true` when the drafted statements are backed by
  collected evidence.

## Cleanup

```sh
rm -rf /tmp/repo-to-content-demo
```
