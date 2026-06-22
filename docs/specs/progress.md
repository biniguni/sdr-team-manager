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
- UI Phase 1 navigation and top-level lineup workflow are implemented in code:
  desktop/menu order includes `라인업`, mobile uses a hamburger side menu, and
  `/lineup` shows active-season match cards with period lineup editing.
- `/lineup` now supports match rosters: editors add players from the season
  squad to a specific match first, then assign only those match-roster players
  to period lineups.
- The right-side lineup panel has been compacted so each position row reads as
  position, player name, and number on one line.
- The lineup right panel is widened to 380px and shows left-foot/right-foot
  scores inline with player identity.
- Player management now supports editable left-foot and right-foot scores from
  1 to 5 for approved editors.
- Default formation seed data now includes `4-2-3-1`.
- The next UI cleanup includes full Korean UI copy cleanup, not just menu-label
  translation. Longer English subtitles, helper text, empty states, permission
  notices, and validation messages should be rewritten in natural Korean by
  screen.
- A temporary UI copy review file now exists at
  `docs/specs/ui/copy-review.md`. Use its `Owner change` column as the source
  for final Korean wording before applying or revising code changes.
- Owner-approved wording from `docs/specs/ui/copy-review.md` has been applied
  to code. Rows with an empty `Owner change` were intentionally left at the
  current/original wording.
- On `/lineup`, pitch position slots can now be tapped/clicked to open the same
  player picker used by the right-side position list.
- Mobile UI polish now includes: tap the lineup field to open a capture-friendly
  enlarged lineup view, tap outside the mobile menu to close it, prevent common
  mobile browser auto-zoom triggers through mobile-sized form controls, keep
  dashboard ranking text horizontal with table scrolling, and expose a
  placeholder `/schedule` route in the menu.
- Dashboard ranking usability was adjusted: the appearance-count header now
  reads `경기`, mobile keeps rank/player columns sticky while stats scroll
  horizontally, and the desktop dashboard gives the ranking table more width
  while narrowing and stretching the match-history panel.
- Navigation links are shared from `src/components/layout/navLinks.ts`, so
  desktop and mobile menu order should stay aligned.
- The lineup pitch is shared through `src/components/lineup/LineupPitch.tsx`,
  so normal and enlarged lineup views use the same field rendering path.
- Current work is not in a data-migration phase. The immediate focus is local
  browser/mobile review, finding awkward flows, and making the lineup screens
  easier to use.

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

- `npm.cmd run lint` passed after the security cleanup code changes.
- `npm.cmd run build` passed after the security cleanup code changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after the match-roster and
  `4-2-3-1` lineup changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after applying the
  owner-approved UI copy.
- `npm.cmd run lint` and `npm.cmd run build` passed after enabling pitch-slot
  tap/click player selection.
- `npm.cmd run lint` and `npm.cmd run build` passed after the mobile lineup,
  menu, dashboard ranking, viewport, and schedule placeholder changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after removing the global
  mobile zoom lock and addressing maintainability review items.
- `npm.cmd run lint` and `npm.cmd run build` passed after the dashboard ranking
  sticky-column and match-history layout changes.
- A targeted source search found no remaining representative original strings
  for the applied owner-approved copy.
- A temporary local dev server returned `200 OK` for `/lineup`.
- `npm.cmd run dev` started successfully in the foreground and reported
  `http://localhost:3000` plus a LAN URL; background launch for this session
  failed due to a PowerShell `Start-Process` PATH-key error.
- `git diff --check` passed; only line-ending warnings were reported.
- General editor behavior is not verified yet because real editor accounts will
  be added later.
- Mobile lineup dragging still needs real-phone verification.

## Next Actions

1. Review the new `/lineup` UI visually with the owner against
   `reference/left_menu_and_lineup_sample.png`.
2. Complete remaining lineup UI Phase 1 work:
   - verify the enlarged lineup capture view on a real phone,
   - polish the desktop pitch/right-panel interaction after visual review,
   - click through buttons and forms to catch errors or awkward flows,
   - review any `copy-review.md` rows that still have an empty `Owner change`
     before changing those strings,
   - polish permission-needed wording where the owner later provides final copy.
3. Defer historical data migration until the lineup/recording workflow and
   needed historical detail level are confirmed.
4. Apply the updated Supabase SQL before deployment review if the target
   database does not already have `match_roster` and the `4-2-3-1` seed.
5. Use `reference/left_menu_and_lineup_sample.png` as the current structure
   reference for desktop navigation and lineup/tactics layout.
6. Work with the owner through one-question-at-a-time planning, local browser
   review, and small code iterations.
7. Keep mobile login/logout/account-state improvements in the UI backlog.
8. When normal editor accounts are added, verify:
   - normal editor can manage general records and lineups,
   - normal editor cannot write match results or player stats,
   - owner/result manager can write match results and player stats.
9. Verify mobile lineup dragging and the mobile side-menu flow on a real phone
   browser.
10. Build the full calendar-style 경기 일정 screen after the owner provides the
    FM reference.

## Remaining Risk

- Normal-editor behavior still needs verification once editor accounts exist.
- Mobile lineup drag, enlarged lineup capture, and outside-tap menu close still
  need real-device verification.
- Remaining review follow-up candidates: keyboard event propagation between
  pitch slots and field enlargement, accessibility polish for the enlarged
  lineup dialog, and longer-term transaction safety for concurrent lineup saves.
- Mobile logout/account UI is not polished yet; it is not a current security
  blocker and should be handled during UI improvement work.
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
