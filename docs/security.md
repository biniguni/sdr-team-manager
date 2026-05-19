# Security Guide

This document explains the security model for SDR Team Manager in practical
terms. Use it before changing Supabase tables, RLS policies, login behavior, or
editor access.

## Current Security Model

The intended operating mode is:

- Public visitors can read team data.
- Only approved editors can create, update, delete, save lineups, or perform
  general team-data management.
- Match result data is more restricted: only the owner, or an editor with
  `can_manage_match_results = true`, can update scores, match completion, MOM
  selections, or player match stats.
- The app does not force every visitor to log in.
- Editors sign in at `/login`.
- Write access is controlled by Supabase Row Level Security (RLS) and the
  `team_editors` allowlist table.
- Public sign-up should be disabled in Supabase Auth. Accounts are created by
  the owner/admin because this is a small-club operations app, not a public
  membership system.

In plain terms: the website is open for viewing, but the database should reject
general changes unless the signed-in user is approved. Result-changing actions
need an extra app-side permission check.

## Key Concepts

- Authentication answers: who is this user?
- Authorization answers: what is this user allowed to do?
- Supabase Auth handles authentication.
- Supabase RLS handles database-level authorization.
- UI gating hides edit buttons for non-editors, but it is not the final security
  layer. RLS is the final database rule.

## Important Files

- `docs/database/supabase-rls.sql`: current RLS and `team_editors` policy script.
- `docs/database/supabase-security-cleanup.sql`: pending cleanup script for
  match-result permission setup and sensitive-value clearing.
- `docs/database/supabase-schema.sql`: main database schema.
- `docs/database/supabase-guest-players.sql`: historical reference migration
  for databases missing guest-player columns. Do not treat guest memo storage as
  current product behavior in public-read mode.
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

RLS remains the final database-level guard for write access. More specific
rules, such as "only result managers can change scores or stats," should be
checked in Server Actions because the current schema stores general match data
and result fields in the same `matches` table.

## Editor Access Rules

Approved editors are stored in `public.team_editors`.

```sql
insert into public.team_editors (user_id, role, can_manage_match_results)
values ('USER_UUID_HERE', 'owner', true);
```

Use:

- `owner` for the project owner. There should initially be one owner.
- `editor` for approved people who can update general team records.
- `can_manage_match_results = true` only for the owner or a trusted editor who
  may update match result data.

When someone should no longer edit, remove their row from `team_editors`.

Initial operating setup:

- Owner account: `role = 'owner'`, `can_manage_match_results = true`.
- Normal editor accounts: `role = 'editor'`,
  `can_manage_match_results = false`.
- If a specific editor later needs score/stat authority, keep
  `role = 'editor'` and set `can_manage_match_results = true`.

General editor actions:

- Player, season, squad, match, and formation management.
- Lineup saving.
- Guest-player creation.

Match result manager actions:

- Score updates.
- Match completion.
- MOM selections.
- Player match stats, including played, goals, assists, yellow cards, and red
  cards.

Normal editors may view result fields, but result inputs should be disabled for
them in the UI and rejected by Server Actions.

## Sensitive Data Policy

The app is intended for public read access, so avoid storing fields that could
contain personal or internal notes unless they are protected by a separate
private design.

The current plan is to remove these fields from app usage and clear existing
values to `null`:

- `players.birth_date`
- `players.contact`
- `players.memo`
- `player_match_stats.memo`

Do not add a private details table yet. If the club later needs contact details
or internal notes, design that as a separate editor-only feature with its own RLS
rules.

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
7. Was the change checked as logged-out visitor, unapproved signed-in user,
   and approved editor?
8. Does the change introduce a free-text note, contact field, birth date, or
   other personal/internal data?
9. If yes, is that field truly needed now, and is it protected from public
   reads?
10. If the change updates scores, MOM selections, completion status, or player
    match stats, does it require `can_manage_match_results = true`?

## basic verification泥댄겕由ъ뒪??
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
3. Signed in as a normal editor with `can_manage_match_results = false`:
   - Confirm general edit controls work.
   - Confirm lineup save works.
   - Confirm score, MOM, match completion, and player-stat inputs are disabled
     or rejected.
4. Signed in as owner or a result manager:
   - Create or update a small low-risk record.
   - Save a lineup change.
   - Update score/MOM or completion status on a test match.
   - Save player match stats.
   - Confirm changes reload correctly.
5. Public data check:
   - Confirm player birth dates, contact details, player memos, guest memos, and
     match-stat memos are not displayed.
   - Confirm existing sensitive values have been cleared to `null` after the
     cleanup SQL is applied.

## Security Cleanup Status

App code and SQL files have been prepared. Supabase-side execution is still
pending before final production basic verification:

1. Apply or confirm `docs/database/supabase-rls.sql`.
2. Apply `docs/database/supabase-security-cleanup.sql` to add
   `can_manage_match_results boolean not null default false`.
3. Update the owner row to `can_manage_match_results = true`.
4. Add normal editors with `can_manage_match_results = false`.
5. Disable public sign-up in Supabase Auth.
6. Confirm sensitive values were cleared to `null`.
7. Keep RLS as public read and approved-editor write unless the product decision
   changes to private access.
8. Complete the basic verifications above.

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
