# Video Demo Brief: Evidence-Backed Launch Pack

## Core Message

repo-to-content turns local repository facts into reviewable launch artifacts:
posts, a video script, launch notes, and an evidence file.

## Demo Command

```bash
bash demo/run-fixture-content.sh
```

The demo uses `examples/sample-content-repo`, writes output to a temporary
directory, checks the generated launch note against `evidence.json`, and verifies
that all expected artifacts exist.

## Recording Beats

1. Show the sample repo README and package metadata.
2. Run the fixture demo command.
3. Open `posts.md`, `video-script.md`, and `launch-notes.md`.
4. Open `evidence.json` and explain that the claim checker uses local evidence.
5. End on the safety note: generated content is a review artifact, not an
   automatic publisher.

## Social Hooks

- "Launch content is easier to review when the evidence file ships with it."
- "Generate posts, a video script, and launch notes from local repo facts."
- "repo-to-content is for deterministic launch prep before any human-approved
  publishing step."
