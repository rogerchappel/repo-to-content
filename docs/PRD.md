# PRD: repo-to-content

Status: in-progress
Decision: build now

## Scorecard

Total: 88/100
Band: build now
Last scored: 2026-06-02
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 19/20 | Turning repo work into credible launch content is repetitive and easy to do badly. |
| Demand signal | 17/20 | Every OSS maintainer and devrel workflow needs repo summaries, posts, demos, and changelog copy. |
| V1 buildability | 19/20 | Can be local-first over README, package metadata, git log, changelog, and examples. |
| Differentiation | 13/15 | Focuses on repo-grounded content with verification notes, not generic copywriting. |
| Agentic workflow leverage | 14/15 | Gives agents a repeatable skill for promoting OSS without inventing claims. |
| Distribution potential | 6/10 | Useful as a CLI and as an agent skill. |

## Pitch

Generate grounded social posts, demo scripts, launch notes, and video briefs from a real repository.

## Why It Matters

Roger's next sprint needs promotion to keep pace with the OSS output. This removes the manual step between code and content while keeping claims tied to inspected repo facts.

## Qualification

### Pub Test

Yes: "Point it at a repo; get credible promotional assets grounded in the files and git history."

### Competitors / Adjacent Tools

- Generic AI copywriters: fast, but often hallucinate features and benchmarks.
- Release note generators: useful, but too narrow for video/social/demo workflows.

### Star / Demand Signal

- Maintainers routinely write launch posts, README summaries, changelogs, and demo scripts.
- Roger has an immediate social/video distribution need for 100+ OSS tools.

### Real Problem

OSS work does not promote itself. Agents need a safe content skill that reads the repo first and refuses unsupported claims.

### V1 Buildability

Use local file parsing plus git metadata. No external accounts required.

## V1 Scope

- CLI accepts repo path and optional output format.
- Inspect README, package metadata, docs, examples, tests, and recent git log.
- Emit grounded artifacts: short posts, video script, demo outline, launch thread, and changelog summary.
- Include evidence map linking each claim to a file or commit.

## Out of Scope

- Direct posting to social platforms.
- Engagement analytics.
- Paid media workflows.

## CLI/API Sketch

```bash
repo-to-content ./my-tool --format video-script --format posts --out content/
repo-to-content ./my-tool --check-claims content/post.md
```

## Verification

- Fixture repos with known files and expected grounded outputs.
- Tests for unsupported-claim rejection.
- CLI smoke for each output format.

## Agent Prompt

Build `repo-to-content` as a local-first CLI and reusable agent skill that turns inspected repo facts into promotional assets with evidence-backed claims.
