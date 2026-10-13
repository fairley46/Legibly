# Legibly verification map

Maintained recipes for verifying Legibly's user-facing CLI and CI paths. Read this index, then open the matching feature file.

## Baseline preconditions

- Work from a clone of the repo with Node.js 20+.
- Run commands from `action/` unless a recipe says otherwise.
- Prefer an isolated temp dir only when a recipe mutates files; unit tests need none.
- Run Doctor from `verify-legibly` before driving if anything looks off.
- Never drive a dry-run that shares another agent's `.env.local`.

## Driving conventions

- Treat every command as literal.
- Capture exit code, stdout, and stderr for every step.
- Report an unmet precondition instead of weakening the journey.

## Proof and skip reporting

- CLI proof includes the command, stdout, stderr, and exit code.
- Mutation proof (dry-run) includes a second read of `release-notes/` showing no writes when `DRY_RUN=true`.
- Do not report a skipped entry point as verified through a different path.

## Features

- [Fresh-clone quickstart](./fresh-clone-quickstart.md) — install, typecheck, lint, and unit tests with no secrets.
- [CI platform detection](./ci-platform-detection.md) — Vitest coverage for GitHub, GitLab, Bitbucket, and generic env.
- [Dry-run generation](./dry-run-generation.md) — optional local generate path when `AI_API_KEY` is present.
