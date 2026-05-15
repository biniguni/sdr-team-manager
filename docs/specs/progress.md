# Current Progress

This file is the quick-start status note for future sessions. Keep it concise:
current state, what was verified, next actions, and remaining risk. Detailed
historical logs live in `docs/specs/progress-history.md`.

## Current Product State

- The app has working Phase 0-6 foundation: Next.js app shell, Supabase schema
  scripts, player/season/squad/match/formation management, period lineups,
  player match stats, dashboard, rankings, login scaffolding, and deployment
  notes.
- `docs/security.md` now documents the current public-read and approved-editor
  write security model, RLS checklist, editor access rules, and key-handling
  rules.
- `docs/specs/design.md` has been refreshed for the current environment
  variable guidance, package versions, and actual `src/` folder/component
  structure.
- Existing requirements, design, and task documents now treat `docs/security.md`
  as the source of truth for security design instead of duplicating RLS details.
- Intended operating mode is public read access with approved-editor write
  access.
- Route protection is intentionally disabled, so visitors can open the app
  directly without being forced to log in.
- Editors sign in at `/login`; edit controls are shown only to authenticated
  users whose Supabase Auth user id exists in `team_editors`.
- Vercel has been connected by the project owner. Final production smoke-test
  results are not recorded yet.

## Database State

- The live Supabase `players` table has been checked by the project owner and
  already includes the guest-player columns: `player_type` and `memo`.
- `docs/database/supabase-guest-players.sql` is now only a reference migration
  for another database that is missing those guest-player columns.
- `docs/database/supabase-rls.sql` is the current security script for
  public-read and approved-editor write access. Its live Supabase application
  status still needs confirmation.
- `team_editors` is the allowlist table for write access. The owner account
  should be inserted as `owner`, and other approved editors as `editor`.
- The legacy 26-season import helper files were removed from the repo after
  cleanup. Historical import details are preserved in `progress-history.md`.

## Most Recent Verification

- Earlier implementation phases recorded successful `npm.cmd run lint` and
  `npm.cmd run build` checks in `progress-history.md`.
- The project owner confirmed in Supabase that `players.player_type` and
  `players.memo` exist.
- Current session changed documentation only; no app code or local build was
  run for this docs cleanup.
- Added `docs/security.md` and linked it from repository documentation indexes.
- Updated `docs/specs/design.md` against the current repository tree and
  `package.json`.
- Updated root `AGENTS.md` build-command guidance to reflect the existing
  Next.js package and `npm.cmd` usage on PowerShell.
- Updated `requirements.md`, `design.md`, and `tasks.md` so product/security
  requirements stay connected while detailed Auth/RLS/editor access design lives
  in `docs/security.md`.

## Next Actions

1. Apply or confirm `docs/database/supabase-rls.sql` in the Supabase SQL Editor.
2. Confirm or create the owner Supabase Auth user.
3. Insert the owner user id into `team_editors`.
4. Smoke-test deployed behavior:
   - Logged-out visitor can browse dashboard, rankings, players, seasons, and
     matches.
   - Logged-out visitor cannot see or use create, update, delete, lineup save,
     or stats save controls.
   - Approved editor can sign in and complete a small create/update/save test.
5. Smoke-test guest players as an approved editor: add a guest from a match
   lineup, confirm a 9000-range number when no number is supplied, drag the
   guest into a slot, save, and confirm the guest appears on the stats page.
6. Smoke-test mobile lineup drag on a real phone browser after deployment.

## Remaining Risk

- If `docs/database/supabase-rls.sql` has not been applied, the intended
  public-read and approved-editor write permission model may not be enforced at
  the database level.
- If the owner user id is not present in `team_editors`, login may succeed but
  edit controls will remain unavailable.
- Guest-player schema is present, but guest-player end-to-end behavior still
  needs a deployed-app smoke test with the current RLS/editor setup.
- Mobile lineup drag has code-level support but still needs real-device
  verification.
- Some Korean text in `docs/specs/tasks.md` has appeared as mojibake in
  terminal output. Avoid broad automated edits to that file unless encoding is
  handled carefully.

## History

- Full prior work history: `docs/specs/progress-history.md`.
- Security model and RLS checklist: `docs/security.md`.
- Compact cross-session handoff: `docs/handoff.md`.
