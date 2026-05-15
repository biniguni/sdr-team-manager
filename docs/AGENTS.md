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
5. `security.md` when changing Supabase, Auth, RLS, editor access, or deployment security
6. `handoff.md` when the session is being resumed from a handoff
7. `specs/progress-history.md` only when the detailed past implementation log is needed

## Placement Rules

- Put product requirements, architecture notes, implementation checklists, and
  work history in `docs/specs/`.
- Put deployment and hosting notes in `docs/deployment/`.
- Put Supabase schema, RLS, and database operation SQL in `docs/database/`.
- Put security model, RLS operating rules, key handling, and access-control
  checklists in `docs/security.md`.
- Keep cross-session continuation notes in `docs/handoff.md`.
- Treat `docs/handoff.md` as an ephemeral next-session brief. It may be fully
  replaced before a new session or at the end of a session.
- Keep `docs/specs/progress.md` short and current-state focused. Move older
  detailed progress entries to `docs/specs/progress-history.md`.

## File Map

- `specs/requirements.md`: product requirements and domain rules
- `specs/design.md`: architecture, data model, and app structure
- `specs/tasks.md`: phased implementation checklist
- `specs/progress.md`: current state, next actions, and remaining risk
- `specs/progress-history.md`: detailed historical progress log
- `specs/guest-player-support.md`: guest player behavior notes
- `security.md`: security model, RLS checklist, editor access rules, and key handling
- `deployment/vercel.md`: Vercel deployment checklist
- `database/supabase-schema.sql`: main Supabase schema
- `database/supabase-rls.sql`: public-read and approved-editor write policies
- `database/supabase-guest-players.sql`: guest player migration
- `database/supabase-open-access.sql`: legacy fallback for future no-login mode
- `handoff.md`: compact next-session brief, safe to fully replace

## Update Rules

- When moving or adding docs, keep this index aligned with the actual `docs/`
  structure.
- After a meaningful work unit, update `docs/specs/progress.md` with current
  state, verification, next steps, and remaining risk. If the note is mainly
  historical detail, append or move it to `docs/specs/progress-history.md`
  instead of making `progress.md` long.
- When updating `docs/handoff.md`, prefer replacing the whole file with the
  current app/database/deployment state, what just changed, immediate next
  actions, cautions, and key document links. Do not preserve old handoff text
  for history; use `docs/specs/progress-history.md` for historical detail.
- Keep this file focused on docs placement and reading guidance. Repository-wide
  coding, testing, and communication rules belong in `../AGENTS.md`.
