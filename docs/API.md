# API

repo-to-content exposes a small ESM library from `src/index.js` and a CLI from `src/cli.js`. The public surface is intentionally local-first so agents can call it in dry-run workflows without credentials.

## Repository evidence

`inspectRepo` reads the top-level `README.md`, `package.json`, and `CHANGELOG.md`, plus Markdown files recursively under the repository's `docs/` and `tests/` directories. These relative paths appear in `facts.files` and in generated video-script proof citations. Files and directories resolving outside the repository root are excluded.

## Stability

The V1 API is suitable for release-candidate testing. Treat output shapes as versioned review artifacts before wiring them into external executors.
