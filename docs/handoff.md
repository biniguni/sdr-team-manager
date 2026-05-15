# Handoff - SDR Team Manager

This file is an ephemeral next-session brief. It is safe to replace the whole
file when preparing a new handoff. Historical detail belongs in
`docs/specs/progress-history.md`; current status belongs in
`docs/specs/progress.md`.

## Project Context

- Repository: `D:\kk\backup\project\sdr-team-manager`
- Owner context: explain product impact first, then implementation details in
  plain language.
- Current operating mode: public read access, approved-editor write access.
- Global login blocking is intentionally disabled. Do not turn `src/proxy.ts`
  into a logged-out redirect unless the product decision changes to private
  access.

## Documentation Structure

- `docs/specs/progress.md`: current state, next actions, remaining risk.
- `docs/specs/progress-history.md`: detailed historical implementation log.
- `docs/security.md`: source of truth for Auth, RLS, editor access, key handling,
  and security smoke tests.
- `docs/specs/requirements.md`: product-level requirements.
- `docs/specs/design.md`: app/data/component design; security details point to
  `docs/security.md`.
- `docs/specs/tasks.md`: phased checklist plus `Security Hardening`.
- `docs/deployment/vercel.md`: deployment checklist.
- `docs/AGENTS.md`: documentation index and placement rules.

## What Changed In The Last Session

- Added `docs/security.md` as the central security guide.
- Updated `requirements.md`, `design.md`, and `tasks.md` so security details are
  not scattered across specs and instead reference `docs/security.md`.
- Updated `tasks.md` Phase 6 to clarify that login middleware remains disabled
  for public-read mode.
- Added `Security Hardening` tasks for RLS, `team_editors`, and smoke tests.
- Refreshed `design.md` environment-variable guidance, package versions, and
  actual `src/` folder/component structure.
- Split the long `progress.md` into a concise current-state file and
  `progress-history.md`.
- Marked guest-player DB columns as confirmed in Supabase:
  `players.player_type` and `players.memo` exist.
- Updated `AGENTS.md`, `docs/AGENTS.md`, and deployment docs to reflect the new
  documentation roles.

## Current App And Database State

- Phase 0-6 app foundation is implemented.
- Vercel is connected by the project owner, but final production smoke-test
  results are not recorded.
- Guest-player schema columns exist in the live Supabase `players` table.
- `docs/database/supabase-guest-players.sql` is now only a reference migration
  for another database missing those columns.
- `docs/database/supabase-rls.sql` is the current public-read and
  approved-editor write policy script.
- Live application status of `docs/database/supabase-rls.sql` still needs
  confirmation.

## Immediate Next Actions

1. Apply or confirm `docs/database/supabase-rls.sql` in Supabase SQL Editor.
2. Confirm/create the owner Supabase Auth user.
3. Insert the owner user id into `public.team_editors` as `owner`.
4. Smoke-test deployed behavior:
   - Logged-out visitor can browse public pages and cannot write.
   - Signed-in unapproved user can browse but cannot write.
   - Approved editor can create/update/save a small record, lineup, and stats.
5. Smoke-test guest-player flow as an approved editor.
6. Smoke-test mobile lineup dragging on a real phone browser.

## Verification Notes

- This session changed documentation only.
- No `npm.cmd run lint` or `npm.cmd run build` was run for these docs changes.
- Use `npm.cmd` in PowerShell for app commands; prior sessions hit `npm.ps1`
  execution-policy issues with plain `npm`.

## Cautions

- Do not commit secrets or service role keys.
- Keep Supabase service role keys out of browser code and Vercel public env vars.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser
  public values; RLS must protect the database.
- Some Korean text in `docs/specs/tasks.md` has appeared as mojibake in terminal
  output. Avoid broad automated edits unless encoding is handled carefully.
