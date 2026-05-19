# Vercel Deployment

This project has been connected to Vercel by the project owner.

## Required environment variables

Add these in the Vercel project settings for Production, Preview, and Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the same values currently stored in the local `.env.local` file.

## Deployment status

- Vercel connection: completed by the project owner.
- Intended access mode: public read access, approved-user editing only.
- Login blocking: disabled, so the app opens directly.
- Editor login: available at `/login`.
- Public sign-up should be disabled in Supabase Auth. Editor accounts are
  created by the owner/admin.
- Match result editing is restricted in app code to the owner or editors with
  `can_manage_match_results = true`; the SQL still needs to be applied in
  Supabase.

## Deployment checks

1. Confirm the dashboard opens directly without login blocking.
2. Confirm public visitors can browse data but do not see edit/save controls.
3. Confirm an approved editor can sign in at `/login`.
4. Confirm a normal editor can complete a small general create/update/save test
   but cannot edit scores, completion status, MOM selections, or player match
   stats.
5. Confirm the owner or result manager can edit scores, completion status, MOM
   selections, and player match stats.
6. Confirm public pages do not expose player birth dates, contact details,
   player memos, guest memos, or player-stat memos.

## Current app state

- Login scaffolding exists, and route protection is disabled by request.
- The app is intended to open directly.
- Public access is for reading only.
- Editing is reserved for authenticated users listed in `team_editors`.
- Run `docs/database/supabase-rls.sql` in the Supabase SQL Editor before using the deployed app.
- Run `docs/database/supabase-security-cleanup.sql` before relying on deployed
  editor checks.
- Review `docs/security.md` before changing RLS, editor access, environment keys, or login behavior.
- Before final basic verification, confirm the security cleanup status in
  `docs/security.md`.

## Grant edit access

1. Create or invite the user in Supabase Auth.
2. Find the user's UUID in Supabase Auth.
3. Add that UUID to `team_editors`.

```sql
insert into public.team_editors (user_id, role, can_manage_match_results)
values ('USER_UUID_HERE', 'owner', true);
```

Use `owner` for yourself and `editor` for other people who should be able to
update general records. Normal editors should start with
`can_manage_match_results = false`; set it to `true` only for trusted editors
who may manage scores, MOM selections, completion status, and player match
stats.
