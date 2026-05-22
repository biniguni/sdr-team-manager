# Database Docs

This folder contains Supabase SQL files for the SDR Team Manager database.
Use this page to identify which script is relevant before changing schema,
row-level security, editor permissions, or cleanup data.

## Files

- `supabase-schema.sql`: main database schema for app tables and relationships.
- `supabase-rls.sql`: current row-level security policies and editor allowlist
  policy setup.
- `supabase-security-cleanup.sql`: cleanup and permission script used for the
  current public-read, approved-editor-write security model.
- `supabase-match-roster.sql`: incremental migration for the match roster
  lineup workflow and the `4-2-3-1` default formation.
- `supabase-player-foot-scores.sql`: incremental migration for editable
  left-foot and right-foot player scores.
- `supabase-guest-players.sql`: historical guest-player migration reference for
  databases that are missing guest-player columns.
- `supabase-open-access.sql`: development/open-access policy reference. Do not
  use this for production without reviewing the security impact.

## Recommended Workflow

1. Review `docs/security.md` before changing tables, RLS policies, Auth,
   editor access, or deployment security.
2. Check the current Supabase database state before running SQL. These scripts
   may already have been applied.
3. Apply schema changes before policy changes when both are needed.
4. After changing database behavior, update the related product documents:
   `docs/specs/design.md`, `docs/specs/progress.md`, and `docs/security.md`
   when security behavior changes.
5. Verify the app behavior after running SQL, especially logged-out read access,
   logged-out write blocking, approved editor writes, and match-result
   permission checks.

## Security Notes

- Do not commit Supabase keys, credentials, project secrets, or production-only
  access details.
- Keep table and column names in snake_case to match the existing schema.
- Row-level security is the final database guard. UI controls can hide edit
  buttons, but database policies still need to reject unauthorized writes.
