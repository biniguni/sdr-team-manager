# Changelog

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
