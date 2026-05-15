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

## Deployment checks

1. Confirm the dashboard opens directly without login blocking.
2. Confirm public visitors can browse data but do not see edit/save controls.
3. Confirm an approved editor can sign in at `/login`.
4. Confirm the approved editor can complete a small create/update/save test.

## Current app state

- Login scaffolding exists, and route protection is disabled by request.
- The app is intended to open directly.
- Public access is for reading only.
- Editing is reserved for authenticated users listed in `team_editors`.
- Run `docs/database/supabase-rls.sql` in the Supabase SQL Editor before using the deployed app.
- Review `docs/security.md` before changing RLS, editor access, environment keys, or login behavior.

## Grant edit access

1. Create or invite the user in Supabase Auth.
2. Find the user's UUID in Supabase Auth.
3. Add that UUID to `team_editors`.

```sql
insert into public.team_editors (user_id, role)
values ('USER_UUID_HERE', 'owner');
```

Use `owner` for yourself and `editor` for other people who should be able to update records.
