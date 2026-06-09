# repo-to-content

Generate evidence-grounded launch content from local repository facts.

## Quickstart

```bash
npm install
npm run smoke
```

## CLI

```bash
node src/cli.js fixtures/sample-repo --format posts --out content
node src/cli.js --check-claims content/posts.md content/evidence.json
```

## Demo and promotion artifacts

- [examples/content-sweep-demo.md](examples/content-sweep-demo.md) walks
  through generating posts, a video script, launch notes, and evidence from the
  checked-in fixture repo.
- [docs/promo/launch-pack.md](docs/promo/launch-pack.md) gives a grounded
  short-form promotion pack for explaining the tool.

## Safety notes

This project is local-first. It does not execute external actions or write to live accounts. Outputs are review artifacts that another approval-controlled layer may consume.

## Limitations

- V1 uses deterministic local parsing.
- Fixtures are intentionally small.
- Human review is required before any generated plan or content is used externally.

## Development

Run the same checks locally before opening a PR:

- `npm run check` - node --check src/*.js test/*.test.js
- `npm run build` - node scripts/validate.js
- `npm test` - node --test
- `npm run smoke` - bash scripts/smoke.sh
