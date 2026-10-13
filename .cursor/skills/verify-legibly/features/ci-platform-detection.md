# CI platform detection

Legibly picks GitHub, GitLab, Bitbucket, or generic mode from environment variables so the same action runs on multiple CI systems.

## Sub-features

- `detect-github` returns `github` when `GITHUB_ACTIONS=true`.
- `detect-gitlab` returns `gitlab` when `GITLAB_CI=true`.
- `detect-bitbucket` returns `bitbucket` when `BITBUCKET_BUILD_NUMBER` is set.
- `detect-generic` returns `generic` when none of the above are set.

## How to get to it (user POV)

- Merge or push so CI runs the action on your platform.
- Or run the unit tests that assert each detection path.

## Driving it with the shell

Preconditions:

- Dependencies installed (`npm ci` in `action/`).
- Doctor green.

- **Run suite.** Run `npm test`. Exit code `0`.
- **Confirm coverage.** Transcript includes `ci-platform.test.ts`, `gitlab.test.ts`, and `bitbucket.test.ts` as passed.
- **Proof.** Save `npm test` output to `/opt/cursor/artifacts/verify-legibly/ci-platform/test.txt`.

## Gotchas

- Leaving stale CI env vars in the shell can flip detection during a manual dry-run. Unset them before `npm run dev`.
- Do not assert platform detection by reading source. Drive the tests.
