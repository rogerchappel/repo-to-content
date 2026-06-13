# Launch Note Template

Use this when turning `repo-to-content` output into a reviewed public note.

## Draft

`repo-to-content` generates evidence-backed launch content from local repository
facts. It reads committed project files, writes reviewable Markdown drafts, and
keeps an `evidence.json` file beside the generated content.

## Demo command

```bash
bash demo/run-fixture-content.sh
```

## Review checklist

- Keep claims that appear in `evidence.json`.
- Remove or rewrite claims that `--check-claims` flags.
- Add human context only after a maintainer reviews the repository facts.
- Do not publish generated posts without an approval step.
