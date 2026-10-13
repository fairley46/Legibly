# Dry-run generation

Optional path: generate audience-specific notes locally and print them without writing or committing files.

## Sub-features

- `env-setup` copies `.env.local.example` to `.env.local` and sets `DRY_RUN=true`.
- `dev-run` builds and runs the action against the local config.
- `no-write` confirms `release-notes/` is unchanged after the run.

## How to get to it (user POV)

- Follow docs/setup.md Local Development.
- Set `AI_API_KEY` and `DEPLOY_ENVIRONMENT`, then `cd action && npm run dev`.

## Driving it with the shell

Preconditions:

- `AI_API_KEY` is set for a supported provider.
- `config/team-config.yml` and `config/voice.md` exist.
- `DRY_RUN=true` in `.env.local`.

- **Snapshot files.** Run `find ../release-notes -type f | sort > /tmp/rn-before.txt`.
- **Generate.** Run `npm run dev`. Exit code `0`; stdout contains generated markdown for configured personas.
- **Confirm no write.** Run `find ../release-notes -type f | sort > /tmp/rn-after.txt` and `diff /tmp/rn-before.txt /tmp/rn-after.txt`. Empty diff.
- **Proof.** Save stdout to `/opt/cursor/artifacts/verify-legibly/dry-run/stdout.txt` and keep the diff empty.

## Gotchas

- Without `AI_API_KEY`, this feature is unreachable. Report the missing secret; do not fake output.
- `DRY_RUN=true` must be observed via the file listing, not trusted by name alone.
