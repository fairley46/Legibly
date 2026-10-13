# Fresh-clone quickstart

A hiring-manager or contributor clones the repo and proves the toolchain without any AI or CI secrets.

## Sub-features

- `install` installs action dependencies from the lockfile.
- `typecheck` compiles TypeScript with `tsc --noEmit`.
- `lint` runs ESLint over `src/**/*.ts`.
- `test` runs the Vitest suite to completion.

## How to get to it (user POV)

- Follow the README Quick start "Verify the install" steps after a fresh clone.
- Or open a clean shell in a new clone and run the same commands by hand.

## Driving it with the shell

Preconditions:

- Fresh clone or clean working tree under `/workspace` (or equivalent).
- Node.js 20+ on `PATH`.
- No `AI_API_KEY` required.

- **Install.** Run `cd action && npm ci`. Exit code `0`; `node_modules/` present.
- **Typecheck.** Run `npm run typecheck`. Exit code `0`.
- **Lint.** Run `npm run lint`. Exit code `0`.
- **Test.** Run `npm test`. Exit code `0`; Vitest reports all tests passed.
- **Proof.** Save the four transcripts under `/opt/cursor/artifacts/verify-legibly/quickstart/`.

## Gotchas

- Root `npm test` does not exist. Always `cd action` first.
- `npm install` without the lockfile drifts. Prefer `npm ci`.
- A green typecheck alone is not enough. Run `npm test` too.
