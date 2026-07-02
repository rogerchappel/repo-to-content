# Release Readiness

Use this checklist before publishing, tagging, or asking reviewers to trust a
`repo-to-content` release.

## Package Surface

- CLI bin: `repo-to-content` -> `src/cli.js`
- Library entry: `src/index.js`
- Demo entry: `demo/run-fixture-content.sh`
- Example surface: sample repos, content sweep walkthrough, and demo output
  manifest.
- Documentation surface: API, safety notes, tutorial, and promotion examples.

## Verification Commands

- `npm run check`: syntax-checks source and tests.
- `npm run build`: runs repository validation.
- `npm test`: runs fixture-backed Node tests.
- `npm run smoke`: generates and checks a fixture launch pack.
- `npm run package:smoke`: dry-runs `npm pack` and asserts required release
  artifacts are present.
- `npm run release:check`: runs the full local release gate used by CI.

## Reviewer Notes

- Compare README commands with the current CLI entrypoint.
- Inspect the package-smoke output for unexpected generated files or missing
  tutorial/demo artifacts.
- Keep private repositories, customer claims, and unpublished launch material
  out of fixtures, examples, and public issues.
