# Handoff - SDR Team Manager

This is the next-session brief. Historical detail belongs in
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

## Current App And Database State

- Phase 0-6 app foundation is implemented.
- Vercel is connected by the project owner.
- Security cleanup is implemented in app code and SQL files.
- Supabase-side execution is still pending.
- Live Supabase may still contain sensitive/free-text values until
  `docs/database/supabase-security-cleanup.sql` is applied.
- `docs/database/supabase-rls.sql` is the public-read and approved-editor write
  policy script.
- `docs/database/supabase-security-cleanup.sql` adds match-result authority and
  clears sensitive/free-text values.

## What Changed Recently

- Docs were shortened so current requirements are easier to follow.
- Duplicate `docs/specs/guest-player-support.md` was removed.
- Public sign-up should be disabled in Supabase Auth.
- Owner is one account; normal editors are 2-3 people.
- Normal editors can manage general records, lineups, and guest players.
- Match result data requires `can_manage_match_results`.
- Birth date, contact, player memo, guest memo, and player-stat memo were
  removed from app usage.
- Existing sensitive/free-text DB values should be cleared to `null`.
- Write Server Actions now require approved editor status.
- Score, completion, MOM, and player-stat writes now require match-result
  authority.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

## Immediate Next Actions

1. Apply or confirm `docs/database/supabase-rls.sql` in Supabase SQL Editor.
2. Apply `docs/database/supabase-security-cleanup.sql` in Supabase SQL Editor.
3. Disable public sign-up in Supabase Auth.
4. Confirm or create the owner Supabase Auth user.
5. Insert or update the owner user id in `public.team_editors` as `owner` with
   `can_manage_match_results = true`.
6. Add normal editors with `can_manage_match_results = false`.
7. Run basic verification on deployed behavior:
   - Logged-out visitor can browse public pages and cannot write.
   - Signed-in unapproved user can browse but cannot write.
   - Normal editor can manage general records and lineups but cannot write match
     result data.
   - Owner/result manager can write score, completion, MOM, and player stats.
8. Run basic verification for guest-player flow as an approved editor.
9. Run basic verification for mobile lineup dragging on a real phone browser.

## Cautions

- Do not commit secrets or service role keys.
- Keep Supabase service role keys out of browser code and Vercel public env vars.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser
  public values; RLS must protect the database.
- The deployed app now expects `team_editors.can_manage_match_results`; apply
  the SQL before relying on deployed editor checks.
- Some Korean text in `docs/specs/tasks.md` has appeared as mojibake in
  terminal output. Avoid broad automated edits unless encoding is handled
  carefully.
