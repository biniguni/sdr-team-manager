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
- Current UI copy direction: convert remaining user-facing English to natural
  Korean across menus, titles, subtitles, helper text, empty states, validation
  messages, and permission notices. Treat longer English text as product copy to
  rewrite, not literal word replacement.
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
- Added `docs/specs/ui/copy-review.md` as a temporary working table for Korean
  UI copy review. It includes current/original wording, suggested drafts,
  remaining English copy, and an `Owner change` column for final wording.
- Some UI copy was changed in code as an early draft before the owner clarified
  the desired review flow. Treat those code edits as draft, not final, and
  reconcile them against `docs/specs/ui/copy-review.md`.

## Verification Completed

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- Temporary local dev server returned `200 OK` for `/lineup`.
- `git diff --check` passed with only line-ending warnings.
- Foreground `npm.cmd run dev` starts successfully and reports
  `http://localhost:3000`.

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
  - `src/components/lineup/LineupMatchCards.tsx`
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
   - full Korean UI copy cleanup, including longer subtitles and helper text,
   - apply owner-approved wording from `docs/specs/ui/copy-review.md`,
   - permission wording,
   - mobile side menu behavior,
   - mobile `/lineup` layout.

## Remaining Work / Risks

- Mobile position-tap bottom-sheet selection is not implemented yet.
- Real-phone verification is still needed.
- Period mode change blocking after lineups exist is not implemented yet.
- General editor behavior is not verified yet because real editor accounts will
  be added later.
- Normal editor should be verified later:
  - can manage general records and lineups,
  - cannot write match results or player stats,
  - owner/result manager can write match results and player stats.
- Mobile logout/account UI exists in the side menu but still needs visual
  polish.
- Remaining English UI copy may exist outside menus. Do a screen-by-screen copy
  pass rather than only replacing individual English words.
- Before finalizing Korean UI copy, review `docs/specs/ui/copy-review.md` and
  use the `Owner change` column as the final wording source.

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
