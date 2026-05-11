# Progress Notes

This document is the working handoff log for future coding sessions. Keep it
short and factual so a new session can quickly understand what changed, how it
was verified, what is next, and what risks remain.

## 2026-05-11 - Mobile Lineup Drag Fix

### Completed

- Added a dedicated dnd-kit `TouchSensor` to the lineup board so mobile touch input can start drag-and-drop.
- Added `touch-action: none` and non-selectable drag styling to player cards so phone browsers do not treat lineup dragging as page scrolling or text selection.

### Verified

- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

### Current State

- Mobile lineup drag-and-drop has code-level support for touch input.
- The fix still needs a real phone browser smoke test on the deployed app after deployment updates.

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
- `supabase-rls.sql` is the current security script for enforcing this mode.

### Next Steps

- Confirm the deployed Vercel URL opens directly without login.
- Confirm a non-editor can browse but cannot see edit/save controls.
- Confirm an approved editor can sign in and perform a small edit/save smoke test.
- Keep `team_editors` updated as people are added or removed from edit access.

### Remaining Risk

- The actual deployed URL and final production smoke-test result are not recorded in this file yet.
- If `supabase-rls.sql` has not been applied in Supabase, the intended public-read/approved-edit permission model may not be enforced at the database level.

## 2026-05-11 - Legacy Stats Import Helper

### Completed

- Added `data/import/legacy-26-season-matches.tsv` and `data/import/legacy-26-season-player-stats.tsv` with the provided legacy match list and player goal/assist records.
- Added `scripts/import-legacy-26-season.mjs` to validate legacy rows against the live Supabase `players`, `seasons`, and `matches` tables.
- Added `npm` scripts for dry-run, SQL generation, and direct apply attempts.
- Generated `data/import/legacy-26-season-import.sql`, a ready-to-run SQL file that inserts missing squad members and upserts `player_match_stats`.

### Verified

- Supabase read verification confirmed `26시즌` exists, the 16 legacy matches already exist, and all 235 legacy stat rows resolved to current `player_id` and `match_id` values.
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

- Added `supabase-schema.sql` with Phase 1 tables, constraints, updated-at triggers, and default formation seed data.
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
- Supabase database changes are captured in `supabase-schema.sql`, including MOM columns and an idempotent migration for existing `matches` tables. The SQL has not been executed from this coding session.
- Basic form validation exists in Server Actions. Some simple server-submitted forms currently ignore returned validation messages unless the action redirects successfully.

### Next Steps

- Run `supabase-schema.sql` in the Supabase SQL Editor before using the new screens with real data.
- Manually smoke-test create/edit flows against Supabase once the schema is applied.
- Start Phase 2: simple period lineup saving using the squad, match period, and formation records now in place.

### Remaining Risk

- Because the schema was not applied during this session, database-level verification against live Supabase data is still pending.
- `specs/tasks.md` appears with broken Korean encoding in the terminal; avoid broad automated edits until the file encoding is confirmed.

## 2026-05-11 - Phase 2

### Completed

- Implemented dropdown-based period lineup saving in `src/actions/lineups.ts`.
- Added `SimpleLineupForm` for choosing a period, choosing a formation, and assigning squad players to formation slots.
- Replaced the lineup placeholder page with the actual lineup assignment page.
- Added client-side and server-side duplicate-player prevention for the same period.
- Marked Phase 2 complete in `specs/tasks.md` after browser save/reload smoke testing was confirmed.

### Verified

- First verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- Second verification: `npm.cmd run lint` passed and `npm.cmd run build` passed.
- The live local lineup page for the 26시즌 test match returned `200 OK` and rendered periods, default formations, and squad players from Supabase.
- Browser smoke test confirmed lineup selections can be saved and reloaded.

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
- Marked Phase 3 tasks complete in `specs/tasks.md`.

### Verified

- First verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live lineup page returned `200 OK`.
- Second verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live lineup page returned `200 OK`.
- Browser smoke test confirmed drag assignment, save, refresh, and persisted lineup display.

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
- Marked Phase 4 tasks complete in `specs/tasks.md`.

### Verified

- First verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live stats page returned `200 OK`.
- Second verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, and the live stats page returned `200 OK`.
- Browser smoke test confirmed player stat values save and reload correctly.

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
- Marked Phase 5 tasks complete in `specs/tasks.md`.

### Verified

- First verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, dashboard returned `200 OK`, and ranking returned `200 OK`.
- Second verification: `npm.cmd run lint` passed, `npm.cmd run build` passed, dashboard returned `200 OK`, and ranking returned `200 OK`.

### Current State

- Phase 5 code is implemented and builds successfully.
- Dashboard data is derived from `matches`, `player_match_stats`, `players`, and selected `season`.
- Ranking is sortable by matches, goals, assists, and attacking points.

### Next Steps

- Browser smoke-test the dashboard and ranking with the known 26시즌 sample data.
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
- Added `supabase-rls.sql` with RLS enablement and read/write policies for Phase 0-5 tables.
- Marked Phase 6 task 6.1 complete in `specs/tasks.md`; task 6.2 is intentionally deferred so the app opens directly.

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
- Run `supabase-rls.sql` in the Supabase SQL Editor when you want to enforce auth.
- Connect Vercel, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and deploy.
- Follow `VERCEL.md` for the deployment prep checklist.

### Remaining Risk

- Phase 6 is partially complete by request: auth code exists, but route protection is intentionally disabled until you decide to turn it on.
- If `/login` or `/` appears blank locally, stop the stale Next dev server process and restart with `npm.cmd run dev`; stale dev-server state was observed after switching proxy behavior.

## 2026-05-11 - Vercel Deployment Prep

### Completed

- Added `VERCEL.md` at the repo root with deployment prep steps.
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
- Updated `supabase-rls.sql` to use a `team_editors` allowlist table so only approved authenticated users can write.
- Updated `VERCEL.md` with the owner/editor grant workflow.
- Added UI gating so non-editors can browse data but do not see create, update, delete, lineup save, or stats save controls.
- Kept `supabase-open-access.sql` only as a legacy fallback for a future no-login operating mode.

### Verified

- Static review confirmed the affected writes use the public Supabase client path: player edits, match MOM edits, and player match stats.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.

### Current State

- The deployed app can stay open to everyone for reading.
- Users who are allowed to edit must sign in and exist in `team_editors`.
- Run `supabase-rls.sql` in the Supabase SQL Editor to enforce this mode.
- Add your own Supabase Auth user id to `team_editors` as `owner`, and add other approved users as `editor`.

## 2026-05-08 - Phase 0

### Completed

- Created the Next.js app scaffold with TypeScript, App Router, ESLint, and Tailwind CSS.
- Installed Supabase, drag-and-drop, and chart dependencies.
- Added Supabase browser and server client helpers.
- Added shared TypeScript domain types.
- Added the planned source directory structure for future phases.
- Added Tailwind dashboard color tokens.
- Marked Phase 0 complete in `specs/tasks.md`.
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
