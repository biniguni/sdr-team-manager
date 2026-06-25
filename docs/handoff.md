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
- Current review path is local browser/mobile review plus direct code
  iteration.
- Current UI copy direction: apply only owner-approved wording from
  `docs/specs/ui/copy-review.md`. Rows with an empty `Owner change` should stay
  at the current/original wording until the owner fills them in.
- Current product phase: UI review and usability polish, not historical data
  migration. Click through local screens, find errors or awkward flows, and
  improve the lineup experience in small iterations.
- Temporary copy review file:
  `docs/specs/ui/copy-review.md`. The owner should fill the `Owner change`
  column; apply that wording to code after review.

## Current App And Database State

- Phase 0-6 app foundation is implemented.
- Vercel is connected by the project owner.
- Security cleanup has been implemented in app code and applied in Supabase for
  the current owner workflow.
- `team_editors.can_manage_match_results` exists and owner is set to `true`.
- Public-read mode remains active.
- Sensitive/free-text fields were removed from app usage and cleared to `null`.
- Logged-out write blocking was verified by the owner.
- Sensitive/memo fields disappearing from deployed UI was verified by the
  owner.

## Work Completed In This Session

- Added `reference/left_menu_and_lineup_sample.png` as the concrete desktop
  lineup structure reference.
- Added top-level `라인업` navigation decision to docs and code.
- Reordered desktop and mobile menu:
  `Dashboard`, `라인업`, `Seasons`, `Players`, `Formations`, `Ranking`.
- Replaced mobile bottom-tab direction with a top hamburger/side-menu structure.
- Added planned/current central lineup route: `/lineup`.
- Implemented `/lineup` to show active-season matches only.
- `/lineup` default match selection:
  - nearest upcoming scheduled match,
  - otherwise most recent completed match.
- Added compact horizontal match cards at the top of `/lineup`.
- Added selected-match summary with secondary links:
  - match detail,
  - result entry,
  - player stats.
- Changed match detail `Lineup` link to `/lineup?matchId=...`.
- Replaced the old deep lineup route with a redirect to `/lineup?matchId=...`.
- Updated match creation period defaults:
  - default `1Q`, `2Q`, `3Q`, `4Q`,
  - optional `전반`, `후반`.
- Extended `LineupBoard`:
  - match roster add/remove controls from the season squad,
  - lineup assignment now uses match-roster players only,
  - visible period buttons near the top,
  - formation selector,
  - unsaved status, revert, and save controls near the period controls,
  - central pitch board,
  - right-side position-ordered player panel,
  - unassigned players below assigned positions,
  - right-panel player selection/replacement,
  - compact right-panel rows showing position, player name, and number on one
    line,
  - replacement moves previous player to unassigned,
  - formation change keeps matching position codes and moves unmatched players
    to unassigned after confirmation,
  - unsaved-change confirmation before switching period or match.
- Updated docs:
  - `docs/specs/requirements.md`
  - `docs/specs/design.md`
  - `docs/specs/progress.md`
  - `docs/specs/tasks.md`
  - `docs/specs/ui/requirements.md`
  - `docs/specs/ui/design.md`
  - `docs/specs/ui/tasks.md`
- Added `match_roster` SQL/RLS documentation and seeded default `4-2-3-1`
  formation in `docs/database/supabase-schema.sql`.
- Added editable player left-foot/right-foot scores and
  `docs/database/supabase-player-foot-scores.sql`.
- Changed the guest lineup workflow so guests are match-only participants:
  adding a guest on `/lineup` creates a `match_roster` row with `guest_name` and
  optional `guest_number`, not a `players` row or `squad_members` row.
- Updated lineup saving to use `period_lineups.match_roster_id`, with
  `player_id` retained only for registered-player compatibility and derived
  position-performance refresh.
- Added `docs/specs/ui/copy-review.md` as a temporary working table for Korean
  UI copy review. It includes current/original wording, suggested drafts,
  remaining English copy, and an `Owner change` column for final wording.
- Applied owner-approved UI copy from `docs/specs/ui/copy-review.md` to code.
- Left blank `Owner change` rows at their current/original wording, including
  intentionally retained English labels such as `Operator login`,
  `Editor login`, and blank review items.
- Added mobile-focused lineup polish:
  - tapping the lineup field opens a capture-friendly enlarged lineup view,
  - tapping outside the mobile menu closes it,
  - dashboard ranking tables stay horizontal on mobile through table scrolling,
  - mobile input/select controls use 16px text to avoid common browser auto-zoom,
  - `/schedule` exists as a placeholder 경기 일정 screen and menu item.
- Addressed PR review maintainability items:
  - removed the global `maximumScale: 1` mobile zoom lock,
  - moved shared menu links to `src/components/layout/navLinks.ts`,
  - extracted shared pitch rendering to `src/components/lineup/LineupPitch.tsx`,
  - documented `/schedule` in `docs/specs/design.md`.
- Confirmed that historical data migration is deferred until the lineup and
  record-entry workflow is comfortable and the needed historical detail level is
  decided.
- Tightened layout stability for the remaining lineup menu zoom/width-shift
  report by reserving scrollbar gutter globally, hiding horizontal page
  overflow, and constraining the lineup grid, match-card strip, and pitch width.
- Followed up by making mobile lineup pitch slots and compact player buttons
  responsive, so the width-shift fix does not force cards to overlap on narrow
  screens.
- Corrected the dashboard match-history layout so it sits under the season
  summary on the left and long seasons scroll inside that panel.
- Reorganized the dashboard: season summary and match history are on the left,
  team composition and personal records are on the right. Top page titles now
  use mobile `text-2xl` and desktop `sm:text-3xl`, player status filters reflect
  the selected tab, and match results display as `승/무/패`.

## Verification Completed

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- Temporary local dev server returned `200 OK` for `/lineup`.
- `git diff --check` passed with only line-ending warnings.
- Foreground `npm.cmd run dev` starts successfully and reports
  `http://localhost:3000`.
- `npm.cmd run lint` passed after applying owner-approved UI copy.
- `npm.cmd run build` passed after applying owner-approved UI copy.
- `npm.cmd run lint` passed after the mobile lineup/menu/schedule changes and
  follow-up review maintainability fixes.
- `npm.cmd run build` passed after the mobile lineup/menu/schedule changes and
  follow-up review maintainability fixes.
- A targeted source search found no remaining representative original strings
  for the applied owner-approved copy.
- `npm.cmd run lint` and `npm.cmd run build` passed after the lineup
  zoom/width-shift layout stability changes.
- `npm.cmd run lint` and `npm.cmd run build` passed after making mobile lineup
  pitch slots responsive.
- `npm.cmd run lint` and `npm.cmd run build` passed after changing guests from
  registered players to match-only lineup participants.
- `npm.cmd run lint` and `npm.cmd run build` passed after correcting the
  dashboard match-history height to follow the left column.
- `npm.cmd run lint` and `npm.cmd run build` passed after the dashboard
  reorganization, title-size alignment, player-filter active state fix, and
  Korean result-label changes.

## Current Git State Notes

- Expected modified docs:
  - `docs/specs/requirements.md`
  - `docs/specs/design.md`
  - `docs/specs/progress.md`
  - `docs/specs/tasks.md`
  - `docs/specs/ui/requirements.md`
  - `docs/specs/ui/design.md`
  - `docs/specs/ui/tasks.md`
  - `docs/database/supabase-schema.sql`
  - `docs/database/supabase-rls.sql`
  - `docs/database/supabase-open-access.sql`
  - `docs/database/supabase-match-roster.sql`
  - `docs/database/supabase-player-foot-scores.sql`
  - `docs/handoff.md`
- Expected modified code:
  - `src/actions/lineups.ts`
  - `src/actions/matches.ts`
  - `src/app/(dashboard)/layout.tsx`
  - `src/app/(dashboard)/lineup/page.tsx`
  - `src/app/(dashboard)/seasons/[id]/matches/page.tsx`
  - `src/app/(dashboard)/seasons/[id]/matches/[matchId]/page.tsx`
  - `src/app/(dashboard)/seasons/[id]/matches/[matchId]/lineup/page.tsx`
  - `src/components/layout/MobileNav.tsx`
  - `src/components/layout/Sidebar.tsx`
  - `src/components/lineup/LineupBoard.tsx`
  - `src/components/lineup/LineupPitch.tsx`
  - `src/components/lineup/LineupMatchCards.tsx`
  - `src/components/layout/MobileMenu.tsx`
  - `src/components/layout/navLinks.ts`
  - `src/app/(dashboard)/schedule/page.tsx`
  - `src/types/index.ts`
- `reference/left_menu_and_lineup_sample.png` is an intentional untracked
  reference image from the owner.
- `src/components/lineup/PlayerDraggable.tsx` and
  `src/components/lineup/PositionSlotDroppable.tsx` may still appear modified
  because of file metadata/line-ending state, but no content diff was present
  when checked.

## Immediate Next Actions

1. Run local app:

```powershell
npm.cmd run dev
```

2. Review desktop `/lineup` in the browser against
   `reference/left_menu_and_lineup_sample.png`.

3. Before deployment or shared DB review, apply the updated database SQL if the
   database does not already include:
  - `match_roster`
  - `match_roster.guest_name` and `match_roster.guest_number`
  - `period_lineups.match_roster_id`
  - RLS policies for `match_roster`
  - seeded `4-2-3-1` formation and slots

4. Review mobile:
   - first try the dev server network URL shown by Next.js, for example
     `http://<PC-LAN-IP>:3000`,
   - PC and phone must be on the same Wi-Fi,
   - Windows firewall may need to allow Node/port 3000.

5. If local mobile access is inconvenient, push to GitHub and use Vercel Preview
   for real-phone review.

6. Polish based on review:
   - desktop pitch/right-panel density,
   - click through buttons/forms and fix errors or awkward flows,
   - fill any remaining blank `Owner change` rows in
     `docs/specs/ui/copy-review.md` before changing those strings,
   - permission wording,
   - mobile side menu behavior,
   - mobile `/lineup` layout.
   - verify enlarged lineup capture on a real phone.
   - verify that entering `/lineup` from the menu no longer looks slightly
     zoomed or width-shifted on the affected device.

## Remaining Work / Risks

- Mobile position-tap bottom-sheet selection is not implemented yet.
- Real-phone verification is still needed, including the latest lineup
  zoom/width-shift fix.
- Remaining PR review follow-ups:
  - keyboard Enter/Space on a pitch slot may also trigger field enlargement;
    stop propagation or separate the enlarge trigger,
  - enlarged lineup overlay still needs dialog accessibility polish such as
    `role="dialog"`, `aria-modal`, Escape close, and focus handling,
  - concurrent lineup save and derived position-performance refresh still need
    a later DB transaction/RPC design.
- Period mode change blocking after lineups exist is not implemented yet.
- General editor behavior is not verified yet because real editor accounts will
  be added later.
- Normal editor should be verified later:
  - can manage general records and lineups,
  - cannot write match results or player stats,
  - owner/result manager can write match results and player stats.
- Mobile logout/account UI exists in the side menu but still needs visual
  polish.
- Match-only guests currently participate in lineups only. Stats, MOM,
  rankings, and dashboard summaries still use registered players unless a later
  guest-result reporting design is added.
- Remaining English UI copy may be intentional where `Owner change` is blank.
  Do a screen-by-screen copy pass only after the owner fills final wording.
- Before changing more UI copy, review `docs/specs/ui/copy-review.md` and use
  only the `Owner change` column as the final wording source.
- Do not restart historical migration work yet. If migration resumes later,
  decide first whether old records need full match/period/player/position
  backfill or only reliable match-level stats.

## Cautions

- Do not commit secrets or service role keys.
- Keep Supabase service role keys out of browser code and Vercel public env
  vars.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser
  public values; RLS must protect the database.
- Some Korean text in terminal output can appear as mojibake. Prefer UTF-8 reads
  when checking docs, for example:

```powershell
Get-Content -Raw -Encoding UTF8 docs/handoff.md
```

## Key References

- Current progress: `docs/specs/progress.md`
- UI requirements: `docs/specs/ui/requirements.md`
- UI design: `docs/specs/ui/design.md`
- UI tasks: `docs/specs/ui/tasks.md`
- UI copy review: `docs/specs/ui/copy-review.md`
- Security model: `docs/security.md`
- Database SQL guide: `docs/database/README.md`
- Deployment checklist: `docs/deployment/vercel.md`
- Full history: `docs/specs/progress-history.md`
