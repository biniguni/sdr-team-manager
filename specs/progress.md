# Progress Notes

This document is the working handoff log for future coding sessions. Keep it
short and factual so a new session can quickly understand what changed, how it
was verified, what is next, and what risks remain.

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
