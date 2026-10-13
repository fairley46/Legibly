---
name: verify-legibly
description: Drive Legibly's CLI surface (install, typecheck, lint, unit tests, optional dry-run). Use when proving release-note generation or CI/local quickstart still works after a change.
---

# Verify Legibly

Legibly is a Node.js CLI / CI action. There is no web UI. The primary user path is `cd action && npm …`. Optional dry-run generation needs `AI_API_KEY` and is out of scope for secret-free verification.

## Launch

```bash
cd action
npm ci
npm run build
```

Ready when `test -f dist/index.js` succeeds after build.

For a short-lived CLI there is no long-running server. Each drive starts in its own shell under `action/`.

Teardown: remove only scratch dirs you created (for example `/tmp/legibly-verify-$RUN_ID`). Do not delete `node_modules/` unless the run owns an isolated copy.

## Doctor

```bash
cd action
node -v
test -f package-lock.json
npm run typecheck
npm run lint
```

Doctor fails if typecheck or lint is non-zero, or Node is below 20.

## Drive

Prefer the repo's own scripts. From `action/`:

| Intent | Command | Observable success |
|---|---|---|
| Unit tests | `npm test` | exit 0; Vitest reports all tests passed |
| Typecheck | `npm run typecheck` | exit 0 |
| Lint | `npm run lint` | exit 0 |
| Dry-run generate | `DRY_RUN=true AI_API_KEY=… DEPLOY_ENVIRONMENT=production npm run dev` | notes printed to stdout; no files written under `release-notes/` |

Never invent a second harness. Capture stdout/stderr and exit codes.

## Evidence

Proof lives under `/opt/cursor/artifacts/verify-legibly/` (or `artifacts/verify-legibly/` in a local checkout). Keep:

- `doctor.txt` — Node version, typecheck, lint exit codes
- `test.txt` — full `npm test` transcript
- For dry-run only: `dry-run.txt` plus a before/after `find ../release-notes -type f` listing showing no new files

Standards: exercise the real user path (`npm test` / `npm run dev`), not internal setters. Mocks only where Vitest already isolates CI-env detection.

## Cleanup

Kill only processes this run started (a dry-run `node dist/index.js`). Do not `pkill` by name. Leave evidence files in place.

## Helpers

None yet. Invoke npm scripts directly as shown above.
