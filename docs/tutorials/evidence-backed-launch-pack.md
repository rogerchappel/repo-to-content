# Evidence-backed Launch Pack

This recipe generates a small launch pack from the committed
`examples/sample-content-repo` fixture, then checks the generated launch notes
against the evidence file.

## Run it

```bash
bash demo/run-fixture-content.sh
```

The script creates:

- `posts.md`
- `video-script.md`
- `launch-notes.md`
- `evidence.json`

It then runs `repo-to-content --check-claims` against the generated launch notes
and evidence file.

## Why this matters

`repo-to-content` is meant to produce review artifacts, not live posts. Keeping
the generated claims tied to README, package metadata, and recent git log facts
makes the draft easier to approve or reject before promotion.
