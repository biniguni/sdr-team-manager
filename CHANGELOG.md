# Changelog

## 2026-05-11

### Added

- Added guest-player support with `member` / `guest` player types and optional player notes.
- Added a lineup-screen `+ 용병 추가` flow that creates a guest, assigns a 9000-range temporary number when needed, and adds the guest to the current season squad.
- Added `용병` badges in player, season squad, lineup, stats, MOM, and ranking views.
- Added `supabase-guest-players.sql` for updating existing Supabase databases before deployment.
- Added Vercel deployment prep instructions and updated Phase 6 status.
- Added authenticated-write deployment guidance with Supabase RLS.
- Recorded that Vercel was connected by the project owner and that the current operating mode is public read access with approved-user editing.
- Added `team_editors` allowlist policies so only approved users can edit deployed data.
- Added read-only UI behavior for users who are not approved editors.
- Added Phase 1 database schema SQL for players, seasons, squads, matches, periods, formations, lineups, match stats, and position performance.
- Added management screens for players, seasons, squads, matches, match periods, and formations.
- Added automatic match result display from scores and four match MOM selections: match, defense, midfield, and attack.
- Added Phase 2 dropdown-based lineup assignment by period and formation.
- Added duplicate-player prevention within the same period lineup.
- Added Phase 3 drag-and-drop field board for lineup assignment.
- Added automatic `position_performance` refresh after lineup saves.
- Added Phase 4 player match stats entry for played, goals, assists, cards, and memo.
- Added Phase 5 dashboard and ranking pages based on live Supabase data.
- Added Phase 6 Supabase login scaffolding and RLS SQL preparation.
- Added dashboard navigation for desktop and mobile layouts.
- Added default formation seed data for 4-4-2, 4-3-3, and 3-5-2.

### Verified

- `npm.cmd run lint` passed twice.
- `npm.cmd run build` passed twice.

## 2026-05-08

### Added

- Created the Next.js 16 app scaffold with TypeScript, App Router, ESLint, and Tailwind CSS.
- Added Phase 0 project structure for future dashboard, auth, player, season, match, lineup, stats, and shared component work.
- Installed core dependencies for Supabase, drag-and-drop lineup boards, and charts.
- Added Supabase browser/server client helpers and shared TypeScript domain types.
- Added Tailwind design tokens for the dark dashboard theme.

### Changed

- Marked Phase 0 tasks as complete in `specs/tasks.md`.
- Corrected the local Supabase project URL format in `.env.local` so the Supabase client can build valid REST requests.
- Removed external Google Font fetching from the base layout so production builds work in restricted network environments.

### Verified

- `npm run lint`
- `npm run build`
- Supabase connection reached the project; the `players` table query returned the expected "table not found" response because Phase 1 database tables have not been created yet.
