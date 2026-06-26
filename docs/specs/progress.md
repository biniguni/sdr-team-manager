# Current Progress

This is the short status note for future sessions. Detailed history belongs in
`docs/specs/progress-history.md`.

## Current State

- The app foundation is implemented: Next.js shell, Supabase schema scripts,
  player/season/squad/match/formation management, period lineups, player match
  stats, dashboard, rankings, login screen, match-only guests, and deployment
  notes.
- Intended access mode is public read access with approved editing.
- Global login blocking is intentionally disabled in `src/proxy.ts`.
- Editors sign in at `/login`.
- `team_editors` is the editor allowlist.
- Vercel has been connected by the project owner.
- Match-only guests are stored as match-specific `match_roster` rows with
  `guest_name` and optional `guest_number`; they are not registered as normal
  `players` or season squad members.
- Player, season squad, lineup, match detail, and stats entry flows filter
  registered-player choices to `players.player_type = 'member'`.
- Match-only guests currently work for lineup assignment only. Match stats,
  MOM selections, rankings, and dashboard output remain registered-player based
  until a separate guest-result reporting decision is made.
- `/lineup` is the central active-season lineup workflow. Editors first add
  players from the season squad to a match roster, then assign only those
  match-roster participants to period lineups.
- `/lineup` supports pitch-slot tap/click selection, a compact right-side
  position panel, match-only guest add, mobile field enlargement, outside-tap
  mobile menu close, and compact guest markers so mobile player names remain
  readable.
- Dashboard layout is reorganized with season summary and recent match history
  on the left, team composition and personal records on the right.
- Dashboard summary order is total/win/draw/loss/win rate, recent form, then
  goals/difference and per-match scoring stats. The match-history panel shows
  the latest 7 matches. The personal records heading reads `개인별 주요통계`.
- Ranking keeps the table as the primary view with rank, player, number,
  appearances, goals, assists, and overall match MOM. The ranking table does not
  show win rate or clean sheets.
- Selecting a player in Ranking opens a modal-style personal record view with
  summary cards, trend tabs, position analysis, and opponent records.
- Ranking table MOM count uses only overall match MOM
  (`matches.match_mom_player_id`). Defense, midfield, and attack MOM counts are
  shown only inside personal detail analysis.
- A placeholder `/schedule` route exists in the menu. The full calendar-style
  match schedule screen is still deferred until the owner provides the FM
  reference.
- Navigation links are shared from `src/components/layout/navLinks.ts`, so
  desktop and mobile menu order should stay aligned.
- The lineup pitch is shared through `src/components/lineup/LineupPitch.tsx`,
  so normal and enlarged lineup views use the same field rendering path.
- A static architecture and user-flow chart document exists at
  `docs/flowcharts/system-flows.html`.

## Security State

Security source of truth: `docs/security.md`.

The security cleanup is complete for the current owner workflow:

- `docs/database/supabase-rls.sql` was run or confirmed by the owner.
- `docs/database/supabase-security-cleanup.sql` was run by the owner.
- Public sign-up was handled in Supabase Auth.
- Owner has `can_manage_match_results = true`.
- Approved editor checks are present in write Server Actions.
- Match-result authority checks are present for score, completion, MOM, and
  player-stat writes.
- Birth date, contact, player memo, guest memo, and player-stat memo
  inputs/displays/writes have been removed from app code.
- Sensitive/free-text values were cleared to `null` through SQL cleanup.
- Logged-out write blocking was verified by the owner.
- Sensitive/memo fields disappearing from the deployed UI was verified by the
  owner.

## Verification

- `npm.cmd run lint` and `npm.cmd run build` passed after the match-roster and
  `4-2-3-1` lineup changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after applying the
  owner-approved UI copy.
- `npm.cmd run lint` and `npm.cmd run build` passed after the mobile lineup,
  menu, dashboard ranking, viewport, and schedule placeholder changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after the dashboard
  reorganization, title-size alignment, player-filter active state fix, and
  Korean result-label changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after the dashboard summary
  ordering, recent-7 match-history limit, and personal-stat heading changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after replacing lineup
  guest text badges with compact indicators.
- `npm.cmd run lint` and `npm.cmd run build` passed after adding Ranking MOM
  counts and player detail panels.
- `npm.cmd run lint` and `npm.cmd run build` passed after changing Ranking
  player detail to a modal-style window and removing win rate/clean sheets from
  the ranking table.
- `git diff --check` passed; only line-ending warnings were reported.
- A temporary local dev server returned `200 OK` for `/lineup`.
- `npm.cmd run dev` starts successfully in the foreground and reports
  `http://localhost:3000` plus a LAN URL. Background launch has failed in this
  environment due to a PowerShell `Start-Process` PATH-key error.
- General editor behavior is not verified yet because real editor accounts will
  be added later.
- Mobile lineup dragging and the Ranking personal-detail modal still need
  real-phone verification.

## Next Actions

1. Review `/lineup` visually with the owner against
   `reference/left_menu_and_lineup_sample.png`.
2. Review `/ranking` on desktop and mobile:
   - table columns,
   - player detail modal behavior,
   - trend chart tabs,
   - position analysis,
   - opponent records.
3. Verify the enlarged lineup capture view, mobile lineup dragging, mobile side
   menu, and Ranking detail modal on a real phone browser.
4. For the existing Supabase DB, apply `docs/database/supabase-match-roster.sql`
   before deployment review if it does not already have `match_roster`,
   match-only guest columns, `period_lineups.match_roster_id`, and the
   `4-2-3-1` seed. Use `docs/database/supabase-schema.sql` only for a fresh DB.
5. When normal editor accounts are added, verify:
   - normal editor can manage general records and lineups,
   - normal editor cannot write match results or player stats,
   - owner/result manager can write match results and player stats.
6. Build the full calendar-style 경기 일정 screen after the owner provides the
   FM reference.
7. Leave root `CHANGELOG.md` for release/deployment notes after the next actual
   deployment. It is not the source of truth for in-progress UI review work.

## Remaining Risk

- Normal-editor behavior still needs verification once editor accounts exist.
- Mobile lineup drag, enlarged lineup capture, outside-tap menu close, and the
  lineup menu zoom/width-shift fix still need real-device verification.
- Ranking detail modal layout and chart readability still need real-device
  review.
- Remaining review follow-up candidates: keyboard event propagation between
  pitch slots and field enlargement, accessibility polish for dialogs/modals,
  and longer-term transaction safety for concurrent lineup saves.
- Mobile logout/account UI is not polished yet; it is not a current security
  blocker and should be handled during UI improvement work.
- `docs/database/supabase-match-roster.sql` is a schema migration only. It does
  not delete or convert existing guest-player data; any known test guest rows
  should be removed manually after confirming the exact player.
- Root `CHANGELOG.md` still contains older guest-player wording from a previous
  direction. Update it when preparing a real release note after deployment,
  rather than during the current UI review cycle.
- Some UI copy rows are intentionally still at their current/original wording
  because `Owner change` was left empty.
- Historical data migration is intentionally deferred. For accurate lineup
  backfill later, prepare match, period, player, and position-code data; if that
  detail is unavailable, migrate only reliable match-level stats.

## References

- Security model: `docs/security.md`.
- Database SQL guide: `docs/database/README.md`.
- UI planning: `docs/specs/ui/`.
- Deployment checklist: `docs/deployment/vercel.md`.
- Full history: `docs/specs/progress-history.md`.
- Next-session handoff: `docs/handoff.md`.
