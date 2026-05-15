# Security Guide

This document explains the security model for SDR Team Manager in practical
terms. Use it before changing Supabase tables, RLS policies, login behavior, or
editor access.

## Current Security Model

The intended operating mode is:

- Public visitors can read team data.
- Only approved editors can create, update, delete, save lineups, or save match
  stats.
- The app does not force every visitor to log in.
- Editors sign in at `/login`.
- Write access is controlled by Supabase Row Level Security (RLS) and the
  `team_editors` allowlist table.

In plain terms: the website is open for viewing, but the database should reject
changes unless the signed-in user is approved.

## Key Concepts

- Authentication answers: who is this user?
- Authorization answers: what is this user allowed to do?
- Supabase Auth handles authentication.
- Supabase RLS handles database-level authorization.
- UI gating hides edit buttons for non-editors, but it is not the final security
  layer. RLS is the final database rule.

## Important Files

- `docs/database/supabase-rls.sql`: current RLS and `team_editors` policy script.
- `docs/database/supabase-schema.sql`: main database schema.
- `docs/database/supabase-guest-players.sql`: reference migration for databases
  missing `players.player_type` and `players.memo`.
- `src/lib/authz.ts`: app-side editor status lookup.
- `src/proxy.ts`: route protection placeholder. It currently allows direct app
  access and should stay that way while the product uses public-read mode.
- `docs/deployment/vercel.md`: deployment and editor grant checklist.

## Current RLS Policy Shape

The current security script should enforce this pattern on app tables:

- `SELECT`: allowed publicly with `using (true)`.
- `INSERT`, `UPDATE`, `DELETE`: allowed only for authenticated users whose
  `auth.uid()` exists in `public.team_editors`.
- `team_editors`: users can read their own editor row after login.

This matches the product decision: public read access, approved-editor write
access.

## Editor Access Rules

Approved editors are stored in `public.team_editors`.

```sql
insert into public.team_editors (user_id, role)
values ('USER_UUID_HERE', 'owner');
```

Use:

- `owner` for the project owner.
- `editor` for other approved people who can update records.

When someone should no longer edit, remove their row from `team_editors`.

## Secrets And Keys

- Do not commit `.env.local`.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public
  browser values. They are expected to be visible to the app, so RLS must protect
  the database.
- Never expose a Supabase service role key in browser code, committed files, or
  Vercel public environment variables.
- If a secret is accidentally committed or exposed, rotate it in Supabase and
  update deployment settings.

## Change Checklist

Use this checklist before changing data tables or permissions:

1. Does the change create a new table in the exposed `public` schema?
2. If yes, is RLS enabled for that table?
3. Should logged-out visitors read the table?
4. Should only approved editors write to the table?
5. Does `docs/database/supabase-rls.sql` include the new table?
6. Does the app hide write controls from non-editors?
7. Was the change smoke-tested as logged-out visitor, unapproved signed-in user,
   and approved editor?

## Smoke Test Checklist

After applying RLS or changing editor access:

1. Logged out:
   - Open the dashboard directly.
   - Confirm public pages load.
   - Confirm create, update, delete, lineup save, and stats save controls are not
     available.
2. Signed in but not in `team_editors`:
   - Confirm pages still load.
   - Confirm edit controls remain unavailable.
   - Confirm direct write attempts fail if tested.
3. Signed in and present in `team_editors`:
   - Create or update a small low-risk record.
   - Save a lineup change.
   - Save player match stats.
   - Confirm changes reload correctly.

## Route Protection Decision

Do not enable global login redirects while the product goal is public read
access. If `src/proxy.ts` starts redirecting logged-out visitors to `/login`,
the app will no longer behave as a public dashboard.

Only revisit route protection if the product decision changes to private access
for all pages.

## Supabase References

- Supabase RLS guide: https://supabase.com/docs/guides/database/postgres/row-level-security
- Supabase Auth guide: https://supabase.com/docs/guides/auth
- Supabase API keys guide: https://supabase.com/docs/guides/getting-started/api-keys
