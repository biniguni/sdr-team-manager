# Progress History

This document preserves detailed historical progress entries. Use
`docs/specs/progress.md` for the current state, next actions, and remaining
risk. Add to this file when older implementation detail should be kept without
making `progress.md` long.

## 2026-06-26 - Dashboard, Lineup, Ranking UI Updates

### Completed

- Adjusted dashboard summary ordering so total/win/draw/loss/win rate are first,
  recent form is next, and goals/difference plus per-match scoring stats sit
  below.
- Limited the dashboard match-history panel to the latest 7 matches.
- Renamed the dashboard personal stat heading to `개인별 주요통계`.
- Replaced lineup match-only guest text badges with compact indicators in
  lineup player cards and selection rows so mobile player names remain readable.
- Added overall match MOM counts to Ranking, based only on
  `matches.match_mom_player_id`.
- Reworked Ranking so the table remains the primary view with rank, player,
  number, appearances, goals, assists, and MOM columns.
- Added a modal-style personal record view from Ranking player-name clicks.
- Added Ranking personal detail sections for summary cards, trend tabs,
  position analysis, and opponent records.
- Excluded rating and season-insight sections because rating data does not
  exist.
- Updated docs to align current requirements, technical design, UI design,
  copy-review wording, flowchart text, progress, and handoff notes.

### Verified

- `npm.cmd run lint` passed after Ranking modal/table changes.
- `npm.cmd run build` passed after Ranking modal/table changes.
- `git diff --check` passed; only line-ending warnings were reported.

### Remaining Risk

- Ranking detail modal, chart readability, and lineup compact guest indicators
  still need real-phone review.

## 2026-05-20 - Legacy Design Note

- Replaced the old Kiro design reference with the current `docs/specs/design.md`
  as the maintained design source of truth; `docs/specs/kiro-design.md` is safe
  to delete if no longer needed.

## 2026-05-15 - Design Document Structure Refresh

### Completed

- Updated `docs/specs/design.md` environment-variable guidance to match the current repo root, Vercel environment variable use, and security note for public Supabase keys.
- Updated the technology stack table to reflect current package versions, including React 19 and Recharts 3.x.
- Replaced the old planned `src/` tree with the actual app/action/component/lib/type structure currently present in the repository.
- Removed stale component expectations from the main structure section and clarified that several planned list/selector/table components are currently folded into page or existing form/dashboard components.
- Updated root `AGENTS.md` build-command guidance to remove the stale "no runnable application package" note and prefer `npm.cmd` on PowerShell.
- Updated `requirements.md`, `design.md`, and `tasks.md` so security details point to `docs/security.md` as the source of truth instead of being duplicated across specs.
- Added a `Security Hardening` task section for RLS application, `team_editors` setup, and logged-out/unapproved/approved user basic verifications.

### Verified

- Compared the design document against `package.json`, `src/`, `docs/`, and root-level files.
- Searched `docs/specs/design.md` for stale planned component names and corrected the remaining lineup flow reference.
- Searched requirements, design, and tasks for Auth/RLS/security references and aligned stale policy wording with the current public-read/approved-editor model.

### Current State

- `docs/specs/design.md` now reflects the current project layout more accurately.

### Remaining Risk

- The broader design document may still contain older MVP wording outside the environment and structure sections; future edits should continue to compare against the actual codebase.

## 2026-05-15 - Guest Player Database Columns Confirmed

### Completed

- Updated project notes to reflect that the live Supabase `players` table already has the guest-player columns: `player_type` and `memo`.
- Removed the prior assumption that `docs/database/supabase-guest-players.sql` still needs to be run before guest-player reads or creation can work.

### Verified

- Project owner checked Supabase directly and confirmed both `players.player_type` and `players.memo` exist.

### Current State

- Guest-player schema support is present in the live Supabase database.
- Guest-player app code remains implemented and ready to use with the existing `player_id`-based lineup, stats, MOM, dashboard, and ranking flows.

### Next Steps

- Continue with Phase 6 follow-through from RLS policy application and production basic verification
- basic verification as an approved editor: open a match lineup, add a guest without a number, confirm a 9000-range number appears, drag the guest into a slot, save, and confirm the guest appears on the stats page.

### Remaining Risk

- Guest-player end-to-end behavior still needs a deployed-app basic verification after confirming the current RLS/editor setup.

## 2026-05-13 - Docs Knowledge Restructure

### Completed

- Moved project knowledge documents under `docs/` so product specs, deployment notes, handoff notes, and database SQL are easier to find.
- Moved former `specs/` files to `docs/specs/`.
- Moved Vercel deployment notes to `docs/deployment/vercel.md`.
- Moved Supabase SQL scripts to `docs/database/`.
- Updated `AGENTS.md`, `docs/handoff.md`, and document path references to point at the new locations.

### Verified

- Searched repository text for stale root-level spec, deployment, and Supabase SQL references.
- Confirmed the new `docs/` file layout exists.

### Current State

- Human-readable project knowledge now lives under `docs/`.
- App source code, data import files, scripts, and runtime config remain in their existing top-level folders.

### Next Steps

- Use `docs/specs/progress.md` and `docs/specs/tasks.md` as the starting point for future implementation sessions.

### Remaining Risk

- Some Korean text still displays as mojibake in terminal output, so future broad edits to Korean documents should continue to be handled carefully.

## 2026-05-13 - Docs Index Guidance

### Completed

- Added `docs/AGENTS.md` as a docs-only placement guide and index.
- Documented the preferred reading order for documentation work inside `docs/`.
- Added folder-level placement rules for `docs/specs/`, `docs/deployment/`, `docs/database/`, and `docs/handoff.md`.

### Verified

- Checked the current `docs/` tree and aligned the index with the files that exist now.

### Current State

- `docs/AGENTS.md` can now guide future documentation work without changing repository-wide instructions in the root `AGENTS.md`.

### Next Steps

- Keep `docs/AGENTS.md` updated whenever new documentation areas are added under `docs/`.

### Remaining Risk

- If document categories grow beyond the current `specs`, `deployment`, and `database` groups, this index will need to be expanded to stay useful.

## 2026-05-13 - Legacy Import Cleanup

### Completed

- Removed the one-time 26-season legacy import source files from `data/import/`.
- Removed `scripts/import-legacy-26-season.mjs`.
- Removed the legacy import npm scripts from `package.json`.
- Kept the previous `Legacy Stats Import Helper` progress entry below as the historical record of how the import was prepared and verified.

### Verified

- Confirmed the cleanup targets were limited to the legacy import data files, helper script, and npm script entries.

### Current State

- The repository no longer exposes one-time legacy import commands.
- The import history remains documented in this progress log.

### Next Steps

- If the 26-season import ever needs to be recreated, use the historical progress notes and database state as the starting point rather than a live npm command.

### Remaining Risk

- Re-running the exact old import is no longer possible from checked-in local helper files.

## 2026-05-11 - Guest Player Support

### Completed

- Added guest-player data fields: `players.player_type` (`member` / `guest`) and optional `players.memo`.
- Added `docs/database/supabase-guest-players.sql` for applying the guest-player columns to an existing Supabase database.
- Added `+ ??紐끒??怨뺣뼺?` on the lineup screen for approved editors.
- Guest creation now inserts a `players` row with `player_type = 'guest'`, assigns a 9000-range number when needed, and immediately adds the player to the current season squad.
- Kept lineup and stats storage on `player_id`, so guest players work with `period_lineups`, `player_match_stats`, MOM selections, dashboard, and rankings.
- Added `??紐끒? badges across player management, season squad, lineup, stats, MOM options, and ranking displays.
- Added `docs/specs/guest-player-support.md` and updated requirements/design notes with the guest-player decision.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

### Current State

- Code support for guest players is implemented and builds successfully.
- The live Supabase database has been checked by the project owner and already includes `players.player_type` and `players.memo`.

### Next Steps

- Deploy the updated app to Vercel.
- basic verification as an approved editor: open a match lineup, add a guest without a number, confirm a 9000-range number appears, drag the guest into a slot, save, and confirm the guest appears on the stats page.

### Remaining Risk

- Guest number assignment is app-level and retries on conflicts; simultaneous guest creation by multiple editors should be rare, but a unique-number conflict can still require retrying.

## 2026-05-11 - Mobile Lineup Drag Fix

### Completed

- Added a dedicated dnd-kit `TouchSensor` to the lineup board so mobile touch input can start drag-and-drop.
- Added `touch-action: none` and non-selectable drag styling to player cards so phone browsers do not treat lineup dragging as page scrolling or text selection.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

### Current State

- Mobile lineup drag-and-drop has code-level support for touch input.
- The fix still needs a real phone browser basic verification on the deployed app after deployment updates.

### Next Steps

- Deploy the latest commit to Vercel.
- On mobile, sign in as an approved editor and test dragging a squad player onto a field slot, moving between slots, moving back to the bench, and saving.

### Remaining Risk

- Some mobile browsers can still prioritize vertical scrolling if the drag starts from outside the player card; test by long-pressing briefly on the player card before moving.

## 2026-05-11 - Vercel Connected and Public Read / Approved Edit Mode

### Completed

- Confirmed the project owner connected the app to Vercel.
- Confirmed the latest intended operating mode is public read access with editing limited to authenticated users listed in `team_editors`.
- Kept route protection disabled so visitors can open the deployed app directly without being forced to log in.
- Kept login available for approved editors who need create, update, delete, lineup save, or stats save controls.

### Verified

- Prior local verification for this mode passed with `npm.cmd run lint` and `npm.cmd run build`.
- Deployment connection was completed outside this coding session by the project owner, so no local Vercel CLI deployment output is recorded here.

### Current State

- Vercel is connected.
- The app should be usable as a public read-only dashboard for visitors.
- Approved editors must sign in and must have their Supabase Auth user id present in `team_editors`.
- `docs/database/supabase-rls.sql` is the current security script for enforcing this mode.

### Next Steps

- Confirm the deployed Vercel URL opens directly without login.
- Confirm a non-editor can browse but cannot see edit/save controls.
- Confirm an approved editor can sign in and perform a small edit/save basic verification
- Keep `team_editors` updated as people are added or removed from edit access.

### Remaining Risk

- The actual deployed URL and final production basic verification result are not recorded in this file yet.
- If `docs/database/supabase-rls.sql` has not been applied in Supabase, the intended public-read/approved-edit permission model may not be enforced at the database level.

## 2026-05-11 - Legacy Stats Import Helper

### Completed

- Added `data/import/legacy-26-season-matches.tsv` and `data/import/legacy-26-season-player-stats.tsv` with the provided legacy match list and player goal/assist records.
- Added `scripts/import-legacy-26-season.mjs` to validate legacy rows against the live Supabase `players`, `seasons`, and `matches` tables.
- Added `npm` scripts for dry-run, SQL generation, and direct apply attempts.
- Generated `data/import/legacy-26-season-import.sql`, a ready-to-run SQL file that inserts missing squad members and upserts `player_match_stats`.

### Verified

- Supabase read verification confirmed `26??戮겹궢` exists, the 16 legacy matches already exist, and all 235 legacy stat rows resolved to current `player_id` and `match_id` values.
- `node scripts/import-legacy-26-season.mjs` dry-run reported 235 resolved stat rows, 31 squad additions, and no missing players or matches.
- `node scripts/import-legacy-26-season.mjs --sql` generated the SQL import file successfully.
- `npm.cmd run lint` passed after adding the migration helper files.

### Current State

- The import mapping is complete and reproducible from local files.
- Direct API writes from the local script are blocked by Supabase RLS for `squad_members` when using the anon key without an authenticated session.
- The generated SQL file is the safest current import path because it runs in the Supabase SQL Editor with project-admin privileges.

### Next Steps

- Run `data/import/legacy-26-season-import.sql` in the Supabase SQL Editor.
- After the SQL runs, verify that `player_match_stats` contains 235 imported rows for the 16 legacy matches and that the season squad includes the imported players.

### Remaining Risk

- The current app UI still treats lineup assignment as the gate for manual stat editing, so imported stats can exist without historical lineup records.
- If you later want the historical match pages to behave like fully entered matches, lineup backfill would be a separate migration task.

## 2026-05-11 - Phase 1

### Completed

- Added `docs/database/supabase-schema.sql` with Phase 1 tables, constraints, updated-at triggers, and default formation seed data.
- Implemented basic management screens for players, seasons, season squads, matches, match periods, and formations.
- Added Server Actions for creating/updating/deactivating players, creating/updating seasons, adding/removing squad members, creating/updating/completing matches, and creating/deleting custom formations.
- Added automatic match result calculation from Sandro/opponent scores and added four match-level MOM fields: match, defense, midfield, and attack.
- Added shared dashboard layout, sidebar, mobile navigation, and basic UI components.
- Added placeholder pages for lineup, match stats, and ranking so navigation does not dead-end before later phases.

### Verified

- First verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- Second verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- Initial `npm run ...` commands failed only because PowerShell blocked `npm.ps1`; rerunning with `npm.cmd` verified the app successfully.

### Current State

- Phase 1 application code is implemented and builds successfully.
- Supabase database changes are captured in `docs/database/supabase-schema.sql`, including MOM columns and an idempotent migration for existing `matches` tables. The SQL has not been executed from this coding session.
- Basic form validation exists in Server Actions. Some simple server-submitted forms currently ignore returned validation messages unless the action redirects successfully.

### Next Steps

- Run `docs/database/supabase-schema.sql` in the Supabase SQL Editor before using the new screens with real data.
- Manually basic verification create/edit flows against Supabase once the schema is applied.
- Start Phase 2: simple period lineup saving using the squad, match period, and formation records now in place.

### Remaining Risk

- Because the schema was not applied during this session, database-level verification against live Supabase data is still pending.
- `docs/specs/tasks.md` appears with broken Korean encoding in the terminal; avoid broad automated edits until the file encoding is confirmed.

## 2026-05-11 - Phase 2

### Completed

- Implemented dropdown-based period lineup saving in `src/actions/lineups.ts`.
- Added `SimpleLineupForm` for choosing a period, choosing a formation, and assigning squad players to formation slots.
- Replaced the lineup placeholder page with the actual lineup assignment page.
- Added client-side and server-side duplicate-player prevention for the same period.
- Marked Phase 2 complete in `docs/specs/tasks.md` after browser save/reload basic verification was confirmed.

### Verified

- First verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- Second verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- The live local lineup page for the 26??戮겹궢 test match returned `200 OK` and rendered periods, default formations, and squad players from Supabase.
- Browser basic verification confirmed lineup selections can be saved and reloaded.

### Current State

- Phase 2 is complete and builds successfully.
- Lineups save by deleting the selected period's existing assignments and inserting the current dropdown assignments.
- Each period can use the same player independently, but the same player cannot be assigned twice within one period.

### Next Steps

- Start Phase 3 after the simple save flow is confirmed: drag-and-drop lineup board using the Phase 2 save action.

### Remaining Risk

- Phase 3 will replace the dropdown UI with a drag-and-drop field board while reusing the Phase 2 save action.

## 2026-05-11 - Phase 3

### Completed

- Added draggable player cards using dnd-kit.
- Added droppable formation position slots using stored `position_slots.x` and `position_slots.y` coordinates.
- Replaced the lineup dropdown UI with an interactive field board.
- Supported dragging players from the squad list to slots, moving players between slots, and dragging players back to the bench area.
- Extended lineup saving to refresh `position_performance` counts for each season/player/position combination.
- Marked Phase 3 tasks complete in `docs/specs/tasks.md`.

### Verified

- First verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live lineup page returned `200 OK`.
- Second verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live lineup page returned `200 OK`.
- Browser basic verification confirmed drag assignment, save, refresh, and persisted lineup display.

### Current State

- Phase 3 code is implemented and builds successfully.
- The lineup page now uses a field board instead of dropdown slot controls.
- The Phase 2 save action is reused, so saved lineups continue to use the same `period_lineups` table.

### Next Steps

- Start Phase 4 after the drag-and-drop save flow is confirmed: match player stats entry.

### Remaining Risk

- No open Phase 3 risks. Later UI polish can happen during dashboard and responsive layout review.

## 2026-05-11 - Phase 4

### Completed

- Added `src/actions/stats.ts` with `savePlayerMatchStats()` and `getMatchStats()`.
- Added `PlayerStatsForm` for inline player match record entry.
- Replaced the match stats placeholder page with a real stats entry page.
- Limited stat entry to players assigned in at least one period lineup for the match.
- Added validation that goals, assists, yellow cards, and red cards are zero or greater.
- Marked Phase 4 tasks complete in `docs/specs/tasks.md`.

### Verified

- First verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live stats page returned `200 OK`.
- Second verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live stats page returned `200 OK`.
- Browser basic verification confirmed player stat values save and reload correctly.

### Current State

- Phase 4 code is implemented and builds successfully.
- Stats are saved with UPSERT into `player_match_stats`, one record per match/player.
- The UI shows lineup assignment status, entered/not-entered status, and disables stat entry for unassigned squad players.

### Next Steps

- Start Phase 5 after stats save/reload is confirmed: dashboard and rankings based on match records.

### Remaining Risk

- No open Phase 4 risks. Dashboard aggregation can now use saved `player_match_stats`.

## 2026-05-11 - Phase 5

### Completed

- Read `reference/sandro_fc_dashboard.html` and used its dark dashboard structure: season summary, 2x2 stat cards, match history panel, and ranking table.
- Added season filter with URL query state.
- Added season summary card with W/D/L, win rate, goals for/against, goal difference, and recent form.
- Added stat cards for top scorer, top assister, top attacking points, and most appearances.
- Added match history panel with score, result, venue, home/away, and MOM badges.
- Added sortable attacking ranking table and ranking page.
- Replaced the dashboard home placeholder with live Supabase aggregations.
- Marked Phase 5 tasks complete in `docs/specs/tasks.md`.

### Verified

- First verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, dashboard returned `200 OK`, and ranking returned `200 OK`.
- Second verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, dashboard returned `200 OK`, and ranking returned `200 OK`.

### Current State

- Phase 5 code is implemented and builds successfully.
- Dashboard data is derived from `matches`, `player_match_stats`, `players`, and selected `season`.
- At that point, Ranking was sortable by matches, goals, assists, and attacking
  points. Current Ranking behavior is documented in the 2026-06-26 entry above.

### Next Steps

- Browser basic verification the dashboard and ranking with the known 26??戮겹궢 sample data.
- Start Phase 6 after dashboard/ranking behavior is confirmed: Auth, RLS, and deployment.

### Remaining Risk

- Automated verification confirms build and page rendering; visual comparison to the reference should be reviewed in the browser with real viewport sizes.

## 2026-05-11 - Phase 6

### Completed

- Added Supabase email/password login page at `/login`.
- Added login and logout Server Actions.
- Added sign-out action to the desktop sidebar.
- Added `/login` and login/logout actions as optional auth scaffolding.
- Added `src/proxy.ts` as a disabled placeholder for future route protection.
- Added `docs/database/supabase-rls.sql` with RLS enablement and read/write policies for Phase 0-5 tables.
- Marked Phase 6 task 6.1 complete in `docs/specs/tasks.md`; task 6.2 is intentionally deferred so the app opens directly.

### Verified

- First verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- Second verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- Unauthenticated `/login` returned `200 OK`.
- Production build includes the proxy route.

### Current State

- Auth UI is implemented and builds successfully.
- Route protection is currently disabled so the app opens directly without login.
- RLS SQL is prepared but not yet applied to Supabase from this coding session.
- Vercel deployment is not connected from this coding session because it requires project-owner account access.

### Next Steps

- Create or confirm a Supabase Auth user for later use.
- Run `docs/database/supabase-rls.sql` in the Supabase SQL Editor when you want to enforce auth.
- Connect Vercel, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and deploy.
- Follow `docs/deployment/vercel.md` for the deployment prep checklist.

### Remaining Risk

- Phase 6 is partially complete by request: auth code exists, but route protection is intentionally disabled until you decide to turn it on.
- If `/login` or `/` appears blank locally, stop the stale Next dev server process and restart with `npm.cmd run dev`; stale dev-server state was observed after switching proxy behavior.

## 2026-05-11 - Vercel Deployment Prep

### Completed

- Added `docs/deployment/vercel.md` with deployment prep steps.
- Documented the required Vercel environment variables.
- Kept the app in direct-open mode with login protection disabled by request.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

### Current State

- The project is ready to be connected to Vercel.
- Deployment has not been executed from this session because it requires project-owner account access.

### Next Steps

- Connect the repository to Vercel.
- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Deploy the `main` branch and confirm the app opens directly.

## 2026-05-11 - Authenticated Write Mode

### Completed

- Restored the intended permission model: public read access with authenticated writes only.
- Updated `docs/database/supabase-rls.sql` to use a `team_editors` allowlist table so only approved authenticated users can write.
- Updated `docs/deployment/vercel.md` with the owner/editor grant workflow.
- Added UI gating so non-editors can browse data but do not see create, update, delete, lineup save, or stats save controls.
- Kept `docs/database/supabase-open-access.sql` only as a legacy fallback for a future no-login operating mode.

### Verified

- Static review confirmed the affected writes use the public Supabase client path: player edits, match MOM edits, and player match stats.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

### Current State

- The deployed app can stay open to everyone for reading.
- Users who are allowed to edit must sign in and exist in `team_editors`.
- Run `docs/database/supabase-rls.sql` in the Supabase SQL Editor to enforce this mode.
- Add your own Supabase Auth user id to `team_editors` as `owner`, and add other approved users as `editor`.

## 2026-05-08 - Phase 0

### Completed

- Created the Next.js app scaffold with TypeScript, App Router, ESLint, and Tailwind CSS.
- Installed Supabase, drag-and-drop, and chart dependencies.
- Added Supabase browser and server client helpers.
- Added shared TypeScript domain types.
- Added the planned source directory structure for future phases.
- Added Tailwind dashboard color tokens.
- Marked Phase 0 complete in `docs/specs/tasks.md`.
- Added `CHANGELOG.md` for user-facing change summaries.

### Verified

- `npm run lint` passed.
- `npm run build` passed.
- `http://localhost:3000` returned `200 OK` from the local Next.js dev server.
- Supabase client reached the project, but the `players` table does not exist yet because Phase 1 database schema work has not started.

### Current State

- Phase 0 is complete.
- The app shell opens locally.
- Database tables and product features are not implemented yet.
- `.env.local` contains the local Supabase project URL and anon key and is ignored by Git.

### Next Steps

- Start Phase 1 with Supabase database schema creation.
- Add seed data for default formations.
- Implement basic CRUD flows for players, seasons, squads, matches, periods, and formations.

### Remaining Risk

- `npm audit` reports 2 moderate vulnerabilities from scaffold dependencies.
- Supabase query verification cannot return real data until Phase 1 tables are created.
