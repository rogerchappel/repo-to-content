# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

- Ground video-script README, smoke, and proof directions in inspected files
  and omit unavailable directions for empty repositories.
- Reject nonexistent and non-directory repository targets with clear errors
  from the library and CLI while continuing to support empty directories.
- Replace raw package dry-run output with an assertion-backed package smoke
  check for CLI, library, demo, fixture, tutorial, support, and release files.
- Add release-readiness docs for the package surface and reviewer checklist.

## 0.1.0

- Initial public release of the local-first repository-to-content CLI.

## Unreleased

- Declare Node.js `>=22 <25` as the supported runtime range, matching the Node 22 and 24 CI matrix.
