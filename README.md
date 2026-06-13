# repo-to-content

Generate evidence-grounded launch content from local repository facts.

## Quickstart

```bash
npm install
npm run smoke
```

## CLI

```bash
node src/cli.js examples/sample-content-repo --format posts --out content
node src/cli.js --check-claims content/posts.md content/evidence.json
```

## Runnable demo

Generate a fixture launch pack and verify the launch note claims:

```bash
bash demo/run-fixture-content.sh
```

The script writes posts, a video script, launch notes, and `evidence.json` to a
temporary directory. See `docs/tutorials/evidence-backed-launch-pack.md` for the
full recipe.

## Safety notes

This project is local-first. It does not execute external actions or write to live accounts. Outputs are review artifacts that another approval-controlled layer may consume.

## Limitations

- V1 uses deterministic local parsing.
- Fixtures are intentionally small.
- Human review is required before any generated plan or content is used externally.
