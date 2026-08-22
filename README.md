# repo-to-content

Generate evidence-grounded launch content from local repository facts.

Directories without Git metadata are supported, such as downloaded source archives. In that case, Git history is treated as empty and no Git diagnostic is printed.

## Quickstart

```bash
npm ci
npm run smoke
```

## CLI

The repository target must be an existing directory. Empty directories and
directories without Git history are supported.

```bash
# Print selected artifacts as JSON without writing files
node src/cli.js examples/sample-content-repo --format posts

# Write selected artifacts and evidence to an explicit directory
node src/cli.js examples/sample-content-repo --format posts --out content
node src/cli.js --check-claims content/posts.md content/evidence.json
```

`--format` may be repeated with any of `posts`, `video-script`,
`demo-outline`, `launch-notes`, or `changelog`. When `--out` is omitted, the
generated artifacts are printed to standard output and the filesystem is left
unchanged.

Package metadata is optional evidence. If `package.json` contains malformed
JSON, inspection continues with README, repository-path, and Git evidence; the
library includes `Ignored invalid package.json: malformed JSON` in
`facts.warnings`, and the CLI prints the same warning to standard error. The
invalid file and its untrusted contents are omitted from generated evidence.

## Demo and promotion artifacts

Generate a fixture launch pack and verify the launch note claims:

```bash
bash demo/run-fixture-content.sh
```

Verify the generated promo packet:

```bash
bash demo/check-promo-claims.sh
```

The script writes posts, a video script, launch notes, and `evidence.json` to a
temporary directory. It strictly claim-checks `posts.md` and `launch-notes.md`
against the evidence file, and asserts that `video-script.md` and
`evidence.json` were generated for human review. The video script contains
production directions, so it is not treated as a strict claim document. See
`docs/tutorials/evidence-backed-launch-pack.md` for the full recipe.

Claim checking applies to short and long content alike. Blank lines,
marker-only headings and lists, thematic breaks, and the generated
`Evidence-backed capabilities:` and `Recent commits:` section labels are
treated as Markdown structure rather than claims. A `Launch notes:` prefix is
also structural, but the title following it must still match the evidence. A
claim line is supported only when it contains a complete evidence claim; being
a short or partial substring of a longer evidence claim is not sufficient.
Supported text must fill the line, apart from punctuation and the generated
`Here is`, `Built around`, `What it does`, and `Hook: Here is` wrappers;
additional factual text on the same line is rejected.

When a repository has a title but no description or README bullets, generated
posts use the evidence-backed `Here is <title>.` form. Empty `Built around` and
`What it does` template lines are omitted.

- [examples/content-sweep-demo.md](examples/content-sweep-demo.md) walks
  through generating posts, a video script, launch notes, and evidence from the
  checked-in fixture repo.
- [docs/promo/launch-pack.md](docs/promo/launch-pack.md) gives a grounded
  short-form promotion pack for explaining the tool.
- [docs/promo/video-demo-brief.md](docs/promo/video-demo-brief.md) outlines a
  short recording based on the fixture demo.
- [examples/demo-output-manifest.md](examples/demo-output-manifest.md) lists the
  expected files produced by the demo command.
- [docs/tutorials/check-promo-claims.md](docs/tutorials/check-promo-claims.md)
  shows how to claim-check generated posts and launch notes while reviewing the
  generated video script and evidence file.

## Safety notes

This project is local-first. It does not execute external actions or write to live accounts. Outputs are review artifacts that another approval-controlled layer may consume.

## Limitations

- V1 uses deterministic local parsing.
- Fixtures are intentionally small.
- Human review is required before any generated plan or content is used externally.

## Development

Run the same checks locally before opening a PR:

```bash
npm ci
npm run release:check
```

The release gate requires the committed lockfile and verifies that CI retains
its frozen `npm ci` install. Its component commands are:

- `npm run check` - node --check src/*.js test/*.test.js
- `npm run build` - node scripts/validate.js
- `npm test` - node --test
- `npm run smoke` - bash scripts/smoke.sh
- `npm run package:smoke` - assert required package artifacts are present
- `npm run demo:check-promo-claims` - verify the generated promo packet

See [docs/release-readiness.md](docs/release-readiness.md) for the package
surface and reviewer checklist.
