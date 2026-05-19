# Technical Design

This document summarizes the current architecture and data model. It is kept
short on purpose so future agents do not treat old implementation notes as
current requirements.

Security details are centralized in `docs/security.md`.

## Stack

- Next.js App Router 16.x.
- React 19.x.
- TypeScript 5.x.
- Tailwind CSS 3.4.x.
- Supabase PostgreSQL and Supabase Auth.
- Supabase JS client 2.x.
- dnd-kit for lineup drag and drop.
- Recharts for dashboard charts.
- Vercel for deployment.

Use `npm.cmd` in PowerShell for project scripts.

## Environment

Local and Vercel environments need:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

These values are browser-public. Database protection must come from RLS and
Server Action permission checks. Do not commit or expose service role keys.

## App Structure

```text
src/
  proxy.ts
  app/
    (auth)/login/page.tsx
    (dashboard)/layout.tsx
    (dashboard)/page.tsx
    (dashboard)/ranking/page.tsx
    (dashboard)/players/page.tsx
    (dashboard)/formations/page.tsx
    (dashboard)/seasons/page.tsx
    (dashboard)/seasons/[id]/page.tsx
    (dashboard)/seasons/[id]/matches/page.tsx
    (dashboard)/seasons/[id]/matches/[matchId]/page.tsx
    (dashboard)/seasons/[id]/matches/[matchId]/lineup/page.tsx
    (dashboard)/seasons/[id]/matches/[matchId]/stats/page.tsx
  actions/
    auth.ts
    formations.ts
    lineups.ts
    matches.ts
    players.ts
    seasons.ts
    stats.ts
  components/
    auth/
    dashboard/
    layout/
    lineup/
    players/
    stats/
    ui/
  lib/
    authz.ts
    dashboard.ts
    matches.ts
    supabase/
  types/
    index.ts
```

## Access Architecture

- `src/proxy.ts` intentionally does not force login while public-read mode is
  active.
- `src/lib/authz.ts` checks whether the signed-in user exists in
  `team_editors`.
- UI controls should be hidden or disabled for users without the required
  permission.
- Server Actions must enforce permissions before writing.
- Supabase RLS remains the database-level backstop.

Permission levels:

- Public visitor: read only.
- Signed-in unapproved user: read only.
- Normal editor: general team management and lineup operations.
- Match result manager: normal editor permissions plus scores, completion, MOM,
  and player match stats.

`team_editors.can_manage_match_results` is implemented in app code and SQL
files, but still needs to be applied in live Supabase.

## Current Data Model

Main tables:

- `players`
- `seasons`
- `squad_members`
- `matches`
- `periods`
- `formations`
- `position_slots`
- `period_lineups`
- `player_match_stats`
- `position_performance`
- `team_editors`

Core relationships:

```text
players < squad_members > seasons < matches < periods < period_lineups
                                            \         /
                                             formations < position_slots

matches < player_match_stats > players
seasons < position_performance > players
```

## Table Notes

### players

Public-safe player identity and status.

Current app behavior should use:

- `id`
- `name`
- `number`
- `player_type`
- `is_active`
- timestamps

Historical columns `birth_date`, `contact`, and `memo` may still exist in the
database, but the next security cleanup should stop using them and clear
existing values to `null`.

### team_editors

Allowlist for write access.

Current columns:

- `user_id`
- `role`
- `created_at`

Required column:

- `can_manage_match_results boolean not null default false`

Initial values:

- Owner: `role = 'owner'`, `can_manage_match_results = true`.
- Normal editors: `role = 'editor'`, `can_manage_match_results = false`.

### matches

Stores both match metadata and result fields:

- General fields: season, opponent, date, venue, home/away.
- Result fields: our score, opponent score, status, MOM selections.

Because general fields and result fields share one table, result-specific
permission checks should be enforced in Server Actions.

### player_match_stats

Stores per-player match totals:

- played
- goals
- assists
- yellow cards
- red cards

Historical `memo` may still exist in the live database. App code no longer uses
it, and `docs/database/supabase-security-cleanup.sql` clears existing values to
`null`.

### position_performance

Derived table refreshed from lineup data. It tracks season/player/position
appearance counts.

## Key Workflows

### Lineup Save

1. Editor selects match period and formation.
2. Editor drags squad players onto formation slots.
3. Server Action validates period, formation slots, squad membership, and
   duplicate assignment rules.
4. Existing period lineup rows are replaced.
5. `position_performance` is refreshed for the season.

Normal editors may save lineups.

### Guest Player Add

1. Editor adds a guest from the lineup screen.
2. App creates a `players` row with `player_type = 'guest'`.
3. If no number is provided, app assigns a 9000-range temporary number.
4. App adds the guest to the current season squad.
5. Guest can be used in lineups and stats like a normal player.

No guest memo should be collected in public-read mode.

### Match Result Save

Result-changing actions require match-result authority:

- Score update.
- Match completion.
- MOM selection.
- Player match stats save.

Server Actions now check this permission before result-changing writes.

## Public Data Policy

Public pages must not expose:

- Player birth date.
- Player contact details.
- Player or guest memo.
- Player match stat memo.

Inputs/displays/writes have been removed from app code. Apply
`docs/database/supabase-security-cleanup.sql` to clear existing values to `null`.

## Deployment Notes

- Vercel is connected.
- Public read mode is intended.
- Public sign-up should be disabled in Supabase Auth.
- Run and verify the RLS/security SQL before production basic verification
- See `docs/deployment/vercel.md` for deployment checks.
