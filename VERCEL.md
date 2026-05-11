# Vercel Deployment Prep

This project is ready to connect to Vercel.

## Required environment variables

Add these in the Vercel project settings for Production, Preview, and Development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Use the same values currently stored in the local `.env.local` file.

## Deployment steps

1. Connect the Git repository to Vercel.
2. Import the project as a Next.js app.
3. Add the environment variables listed above.
4. Deploy the `main` branch.
5. Confirm the dashboard opens directly without login blocking.

## Current app state

- Login scaffolding exists, but route protection is disabled by request.
- The app is intended to open directly for now.
- Public access is for reading only.
- Editing is reserved for authenticated users listed in `team_editors`.
- Run `supabase-rls.sql` in the Supabase SQL Editor before using the deployed app.

## Grant edit access

1. Create or invite the user in Supabase Auth.
2. Find the user's UUID in Supabase Auth.
3. Add that UUID to `team_editors`.

```sql
insert into public.team_editors (user_id, role)
values ('USER_UUID_HERE', 'owner');
```

Use `owner` for yourself and `editor` for other people who should be able to update records.
