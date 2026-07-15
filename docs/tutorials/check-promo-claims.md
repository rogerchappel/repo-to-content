# Check Promo Claims

Use this recipe when a launch pack is ready for review and you want a fast
local check that every generated Markdown artifact still traces back to the
fixture evidence.

## Run it

```bash
bash demo/check-promo-claims.sh
```

The script writes a fresh launch pack under
`$TMPDIR/repo-to-content-promo-claims` or `/tmp/repo-to-content-promo-claims`,
then runs the claim checker against the publish-facing copy:

- `posts.md`
- `launch-notes.md`

The script also asserts that `video-script.md` and `evidence.json` were written.
The video script includes production directions, so it is reviewed as a demo
planning artifact rather than a strict evidence-claim document.

Each claim check uses the generated `evidence.json`, which is built from the
fixture README, package metadata, and recent git history.

## Review flow

1. Generate the packet with `bash demo/check-promo-claims.sh`.
2. Open the output directory and review the Markdown drafts.
3. Treat a failing claim check as a rewrite request, not as publish approval.
4. Keep human review in the loop before copying any text to a public channel.

This mirrors the project guardrail: `repo-to-content` creates review artifacts,
not auto-published launch copy.
