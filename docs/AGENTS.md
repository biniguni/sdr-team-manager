# Docs Guidelines

This file applies only to documentation work under `docs/`.
For repository-wide instructions, see `../AGENTS.md`.

Use this file as the documentation index, placement guide, and reading order
for future documentation updates.

## Reading Order

Read these files first when resuming work or updating product-facing
documentation:

1. `specs/progress.md`
2. `specs/tasks.md`
3. `specs/design.md`
4. `specs/requirements.md`
5. `handoff.md` when the session is being resumed from a handoff

## Placement Rules

- Put product requirements, architecture notes, implementation checklists, and
  work history in `docs/specs/`.
- Put deployment and hosting notes in `docs/deployment/`.
- Put Supabase schema, RLS, and database operation SQL in `docs/database/`.
- Keep cross-session continuation notes in `docs/handoff.md`.

## File Map

- `specs/requirements.md`: product requirements and domain rules
- `specs/design.md`: architecture, data model, and app structure
- `specs/tasks.md`: phased implementation checklist
- `specs/progress.md`: concise work history and current state
- `specs/guest-player-support.md`: guest player behavior notes
- `deployment/vercel.md`: Vercel deployment checklist
- `database/supabase-schema.sql`: main Supabase schema
- `database/supabase-rls.sql`: public-read and approved-editor write policies
- `database/supabase-guest-players.sql`: guest player migration
- `database/supabase-open-access.sql`: legacy fallback for future no-login mode
- `handoff.md`: compact continuation note for the next session

## Update Rules

- When moving or adding docs, keep this index aligned with the actual `docs/`
  structure.
- After a meaningful documentation reorganization, update
  `docs/specs/progress.md` with what changed, how it was verified, current
  state, next steps, and remaining risk.
- Keep this file focused on docs placement and reading guidance. Repository-wide
  coding, testing, and communication rules belong in `../AGENTS.md`.
