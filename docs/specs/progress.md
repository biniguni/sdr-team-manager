# Current Progress

This is the short status note for future sessions. Detailed history belongs in
`docs/specs/progress-history.md`.

## Current State

- The app foundation is implemented: Next.js shell, Supabase schema scripts,
  player/season/squad/match/formation management, period lineups, player match
  stats, dashboard, rankings, login screen, guest players, and deployment notes.
- Intended access mode is public read access with approved editing.
- Global login blocking is intentionally disabled in `src/proxy.ts`.
- Editors sign in at `/login`.
- `team_editors` is the editor allowlist.
- Vercel has been connected by the project owner.
- Final production basic verification results are not recorded yet.

## Current Security State

Security source of truth: `docs/security.md`.

Security cleanup is implemented in app code and SQL files. Supabase-side
execution is still pending:

- Public sign-up still needs to be disabled in Supabase Auth.
- `team_editors.can_manage_match_results boolean not null default false` still
  needs to be applied in Supabase.
- Owner should be `role = 'owner'` and `can_manage_match_results = true`.
- Normal editors should be `role = 'editor'` and
  `can_manage_match_results = false`.
- Approved editor checks are now present in write Server Actions.
- Match-result authority checks are now present for score, completion, MOM, and
  player-stat writes.
- Birth date, contact, player memo, guest memo, and player-stat memo
  inputs/displays/writes have been removed from app code.
- Existing sensitive/free-text values still need to be cleared to `null` in
  Supabase using `docs/database/supabase-security-cleanup.sql`.

## Database State

- Live Supabase `players` has `player_type` and `memo` according to owner
  confirmation.
- `docs/database/supabase-guest-players.sql` is only a historical reference
  migration for databases missing guest-player columns.
- `docs/database/supabase-rls.sql` is the current public-read and
  approved-editor write policy script, but live application still needs
  confirmation.
- Existing sensitive/free-text columns may still contain values until cleanup:
  `players.birth_date`, `players.contact`, `players.memo`, and
  `player_match_stats.memo`.

## Verification

- `npm.cmd run lint` passed after the security cleanup code changes.
- `npm.cmd run build` passed after the security cleanup code changes.
- `requirements.md`, `design.md`, and `progress.md` were shortened to current
  source-of-truth summaries. The duplicate guest-player support doc was removed.

## Next Actions

1. Apply or confirm `docs/database/supabase-rls.sql` in Supabase.
2. Apply `docs/database/supabase-security-cleanup.sql` in Supabase.
3. Disable public sign-up in Supabase Auth.
4. Create or confirm owner and editor accounts.
5. Set owner to `can_manage_match_results = true` and normal editors to
   `false`.
6. Run basic verification as:
   - logged-out visitor,
   - signed-in unapproved user,
   - normal editor,
   - owner/result manager.
7. Run basic verification for guest-player flow.
8. Run basic verification for mobile lineup dragging on a real phone browser.

## Remaining Risk

- If RLS is not applied, write protection may not be enforced at the database
  layer.
- Until the new `team_editors.can_manage_match_results` column is applied in
  Supabase, deployed pages that read editor status may fail.
- Until SQL cleanup is applied, public-read access may expose historical
  sensitive/free-text values if they exist in Supabase.
- Guest-player and mobile lineup drag still need deployed-app basic
  verification.

## References

- Security model: `docs/security.md`.
- Deployment checklist: `docs/deployment/vercel.md`.
- Full history: `docs/specs/progress-history.md`.
- Next-session handoff: `docs/handoff.md`.
