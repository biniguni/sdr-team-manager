# Technical Design

SDR Team Manager is a public-read football team management app for a small club.
This document explains how the current app is organized, what each major data
table means, and which parts to check before changing behavior.

> Current source of truth:
> `docs/specs/design.md`, `docs/specs/requirements.md`, and
> `docs/security.md`.
>
> Legacy reference:
> `docs/specs/kiro-design.md` may contain older design notes, but do not treat
> it as current unless a decision has been copied into the current docs.

## Quick Summary

| Area | Current decision | Why it matters |
| --- | --- | --- |
| Access model | Public read, approved-editor write | Visitors can view data without login, but edits are restricted. |
| Editor control | `team_editors` allowlist | Signing in is not enough; the user must be approved. |
| Result control | Extra `can_manage_match_results` flag | Scores and stats are protected more tightly than lineup work. |
| Private data | Do not expose birth dates, contact details, or memos | Public pages must stay safe to share. |
| Data storage | Supabase PostgreSQL | Tables are the product record source. |
| App framework | Next.js App Router | Pages load data on the server; forms write through Server Actions. |
| Deployment | Vercel plus Supabase | Vercel hosts the app, Supabase stores data and handles Auth. |

## Table Of Contents

- [Product Map](#product-map)
- [Technology Stack](#technology-stack)
- [App Structure](#app-structure)
- [Pages](#pages)
- [Access And Permissions](#access-and-permissions)
- [Data Model](#data-model)
- [Table Guide](#table-guide)
- [Write Operations](#write-operations)
- [Main Workflows](#main-workflows)
- [Public Data Policy](#public-data-policy)
- [Database Scripts](#database-scripts)
- [Deployment Notes](#deployment-notes)
- [Maintenance Rules](#maintenance-rules)

## Product Map

The app supports these product areas:

| Product area | What users do | Main data involved |
| --- | --- | --- |
| Players | Add, edit, deactivate, and view players | `players` |
| Seasons | Create seasons and manage active/inactive state | `seasons` |
| Squads | Add players to a season squad | `squad_members` |
| Matches | Create match schedules and later record results | `matches`, `periods` |
| Formations | Manage position templates such as `4-4-2` | `formations`, `position_slots` |
| Lineups | Prepare active-season match rosters and period lineups before match day | `match_roster`, `period_lineups` |
| Schedule | View a future calendar-style match schedule | `matches`, `periods` |
| Guest players | Add match-only guests during lineup work | `match_roster` |
| Match stats | Record played, goals, assists, and cards | `player_match_stats` |
| Dashboard | Summarize season record and player output | `matches`, `player_match_stats` |
| Rankings | Rank players from match stats | `player_match_stats`, `players` |

## Technology Stack

| Layer | Tool | Role |
| --- | --- | --- |
| Web app | Next.js App Router 16.x | Routes, layouts, server-loaded pages, Server Actions |
| UI | React 19.x | Interactive components |
| Language | TypeScript 5.x | Shared types and safer app code |
| Styling | Tailwind CSS 3.4.x | Utility-based styling |
| Database | Supabase PostgreSQL | Persistent records |
| Auth | Supabase Auth | Editor sign-in |
| Database client | Supabase JS client 2.x | App-to-Supabase queries |
| Drag and drop | dnd-kit | Lineup board interaction |
| Charts | Recharts | Dashboard charts |
| Hosting | Vercel | App deployment |

Use `npm.cmd` in PowerShell for project scripts.

## Environment

Local and Vercel environments need:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

These values are browser-public. They are expected to be visible in the app, so
they are not the security boundary. Database protection must come from Supabase
RLS and Server Action permission checks.

Do not commit `.env.local` or any Supabase service role key.

## App Structure

```text
src/
  proxy.ts
  app/
    (auth)/login/page.tsx
    (dashboard)/layout.tsx
    (dashboard)/page.tsx
    (dashboard)/lineup/page.tsx             # planned central lineup workflow
    (dashboard)/schedule/page.tsx           # placeholder for future calendar schedule
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

| Folder | Meaning |
| --- | --- |
| `src/app/` | Pages and layouts users visit. |
| `src/components/` | Visible UI pieces. |
| `src/actions/` | Write operations, validation, permission checks. |
| `src/lib/` | Shared auth, dashboard, match, and Supabase helpers. |
| `src/types/` | Shared TypeScript data shapes. |

## Pages

| Page | User-facing purpose | Notes |
| --- | --- | --- |
| `/` | Dashboard for the selected season | Public-readable. |
| `/lineup` | Active-season lineup planning | Planned central route; can accept `?matchId=...`. |
| `/schedule` | Future calendar-style match schedule | Placeholder screen until the owner provides the FM reference. |
| `/ranking` | Player ranking table | Built from player match stats. |
| `/players` | Player list and player editing | Editor controls hidden for non-editors. |
| `/formations` | Formation management | Used by lineup board. |
| `/seasons` | Season list | Entry point for season work. |
| `/seasons/[id]` | Season detail and squad management | Controls which players can appear in lineups. |
| `/seasons/[id]/matches` | Match list and match creation | Creates match and period records. |
| `/seasons/[id]/matches/[matchId]` | Match detail | Score, MOM, links to central lineup and stats. |
| `/seasons/[id]/matches/[matchId]/lineup` | Legacy/deep lineup route | Keep only as compatibility or redirect after `/lineup` exists. |
| `/seasons/[id]/matches/[matchId]/stats` | Player match stat entry | Requires result-manager authority. |
| `/login` | Editor login | Public visitors do not need this to view data. |

Page implementation pattern:

| Concept | Plain meaning | Current use |
| --- | --- | --- |
| Server Component | Page loads data before sending UI to the browser | Most pages. |
| Client Component | Browser-side interactive UI | Forms, filters, sorting, drag and drop. |
| Server Action | Secure write function called by a form | Create/update/save operations. |

## Access And Permissions

The current product mode is public read access.

| User type | View public data | Manage general records | Save lineups | Edit scores/stats |
| --- | --- | --- | --- | --- |
| Public visitor | Yes | No | No | No |
| Signed-in unapproved user | Yes | No | No | No |
| Normal editor | Yes | Yes | Yes | No |
| Match result manager | Yes | Yes | Yes | Yes |

Important files:

| File | Responsibility |
| --- | --- |
| `src/proxy.ts` | Allows public page access while public-read mode is active. |
| `src/lib/authz.ts` | Checks editor and result-manager permission. |
| `docs/security.md` | Security model, RLS checklist, editor setup. |
| `docs/database/supabase-rls.sql` | Database-level read/write policies. |

Permission helpers:

| Helper | Allows | Use for |
| --- | --- | --- |
| `requireEditor()` | Approved editors | General records, squads, formations, lineups, match-only guests. |
| `requireMatchResultManager()` | Editors with result authority | Scores, completion, MOM, player match stats. |

Design rule: hiding buttons in the UI improves clarity, but it is not security.
Server Actions and Supabase RLS must still reject unauthorized writes.

## Data Model

Core relationship map:

```text
players < squad_members > seasons < matches < match_roster
                                      < periods < period_lineups
                                            \         /
                                             formations < position_slots

matches < player_match_stats > players
seasons < position_performance > players
```

`match_roster` can point to a registered player, or hold a match-only guest
name for lineup use.

Plain-language version:

| Relationship | Meaning |
| --- | --- |
| `players` to `squad_members` to `seasons` | A player joins a specific season squad. |
| `seasons` to `matches` | A match belongs to one season. |
| `matches` to `match_roster` | A match has its own available participant list: registered squad players plus optional match-only guests. |
| `matches` to `periods` | A match is split into periods. |
| `formations` to `position_slots` | A formation defines board positions. |
| `periods` to `period_lineups` | A period has participant-position assignments. |
| `matches` to `player_match_stats` | Player stats are recorded per match. |
| `seasons` to `position_performance` | Position summaries are stored by season. |

## Table Guide

| Table | Stores | Product rule |
| --- | --- | --- |
| `players` | Public-safe player identity, foot scores, and status | Use name, number, left/right foot scores, player type, active status. Do not use private fields in public-read mode. |
| `seasons` | Season name, dates, active status | End date cannot be before start date. |
| `squad_members` | Player-season membership | A player can appear once per season squad. |
| `matches` | Match details and result fields | Result fields need stronger permission checks. |
| `match_roster` | Match participant availability | A registered player can appear once per match roster; guests are stored as match-only names. |
| `periods` | Match parts | Labels and order numbers are unique within a match. |
| `formations` | Formation names | Built-in formations are seeded by SQL. |
| `position_slots` | Positions inside formations | Coordinates stay between 0 and 100. |
| `period_lineups` | Participant assignment to period positions | No duplicate match roster participant or slot in the same period. |
| `player_match_stats` | Per-player match totals | Numeric stats must be zero or greater. |
| `position_performance` | Derived position summary | Refreshed from lineup data after lineup saves. |
| `team_editors` | Approved editor list | Controls write access. |

### Key Table Details

| Table | Important fields |
| --- | --- |
| `players` | `name`, `number`, `left_foot_score`, `right_foot_score`, `player_type`, `is_active` |
| `seasons` | `name`, `start_date`, `end_date`, `is_active` |
| `matches` | `opponent`, `match_date`, `venue`, `is_home`, scores, status, MOM fields |
| `match_roster` | `match_id`, `player_id`, `guest_name`, `guest_number` |
| `position_slots` | `formation_id`, `position_code`, `x`, `y` |
| `period_lineups` | `period_id`, `formation_id`, `position_slot_id`, `match_roster_id`, `player_id` |
| `player_match_stats` | `played`, `goals`, `assists`, `yellow_cards`, `red_cards` |
| `position_performance` | `season_id`, `player_id`, `position_code`, `period_count`, `match_count` |
| `team_editors` | `user_id`, `role`, `can_manage_match_results` |

Historical columns such as `players.birth_date`, `players.contact`,
`players.memo`, and `player_match_stats.memo` may still exist in some live
databases. App code should not use them in public-read mode.

## Write Operations

Every write should follow this order:

1. Check permission.
2. Validate submitted data.
3. Write to Supabase.
4. Revalidate affected pages.
5. Return a clear message.

| Server Action file | Main responsibility | Permission level |
| --- | --- | --- |
| `src/actions/players.ts` | Create, update, deactivate players | Editor |
| `src/actions/seasons.ts` | Create/update seasons and manage squads | Editor |
| `src/actions/matches.ts` | Create/update matches and result fields | Editor or result manager, depending on field |
| `src/actions/formations.ts` | Manage formations and slots | Editor |
| `src/actions/lineups.ts` | Save lineups and add match-only guests | Editor |
| `src/actions/stats.ts` | Save player match stats | Result manager |
| `src/actions/auth.ts` | Login/logout | Signed-in user flow |

## Main Workflows

### Player Management

| Step | What happens |
| --- | --- |
| 1 | Editor creates or updates a player. |
| 2 | App validates name and player number. |
| 3 | Player number must be unique. |
| 4 | Inactive players are hidden from new selection flows. |

Product impact: historical records stay intact even when a player is no longer
active.

### Season And Squad Management

| Step | What happens |
| --- | --- |
| 1 | Editor creates a season with valid dates. |
| 2 | Editor adds active players to the season squad. |
| 3 | Squad membership controls who can be added to match rosters in that season. |
| 4 | A player cannot be added twice to the same squad. |

Product impact: each season can have a different squad while old season data
stays separate.

### Match Creation

| Step | What happens |
| --- | --- |
| 1 | Editor creates a match inside a season. |
| 2 | App stores opponent, date, venue, home/away, and period setup. |
| 3 | New matches default to `1Q`, `2Q`, `3Q`, `4Q`, with an option for `전반`, `후반`. |
| 4 | Period mode can change only before any lineup exists for that match. |
| 5 | Result fields can stay empty until the match is completed. |

Product impact: scheduling and result entry can happen at different times.

### Lineup Save

| Step | What happens |
| --- | --- |
| 1 | Editor opens `라인업`, which shows active-season matches. |
| 2 | App defaults to the nearest upcoming scheduled match, or the most recent completed match if no upcoming match exists. |
| 3 | Editor selects a period and formation. |
| 4 | Editor adds available players from the season squad to the match roster, and may add match-only guests directly on that match. |
| 5 | Editor changes the lineup on the pitch board or in the position-ordered side panel, using only match-roster participants. |
| 6 | Changes remain draft-only until the editor saves. |
| 7 | Server Action validates period, slots, match roster membership, and duplicates. |
| 8 | Existing period lineup rows are replaced. |
| 8 | `position_performance` is refreshed for the season. |

Product impact: trusted editors can manage operational lineup work without also
receiving score/stat authority.

Lineup planning UI rules:

| Rule | Product reason |
| --- | --- |
| Show only active-season matches in `/lineup` | Keeps the pre-match workflow focused. |
| Keep past-season lineups reachable through season/match detail | Avoids mixing old and current planning work. |
| Use compact horizontal match cards | Lets users switch matches without shrinking the pitch board. |
| Save controls live near selected match and period controls | Makes draft status and save action predictable. |
| Confirm before switching match or period with unsaved changes | Prevents accidental loss of lineup planning. |
| Right panel follows formation/position order, with unassigned below | Matches the tactical structure instead of simple player-list sorting. |
| Quarter-copy is deferred | Keeps the first pass focused. |
| Per-period position fine-tuning is deferred | Needs schema support such as lineup-level custom coordinates. |

### Match-Only Guest Add

| Step | What happens |
| --- | --- |
| 1 | Editor adds a guest from the lineup screen for a specific match. |
| 2 | App creates a `match_roster` row with `guest_name` and optional `guest_number`. |
| 3 | App does not create a `players` row or add the guest to the season squad. |
| 4 | Guest can be used in period lineups for that match. |
| 5 | Registered-player stats, MOM selections, rankings, and reports stay tied to `players` unless a later guest-reporting decision changes that. |

Product impact: player registration stays clean while match-day lineups can
still include temporary guests without polluting the season squad.

### Match Result Save

| Result action | Required permission |
| --- | --- |
| Score update | Match result manager |
| Match completion | Match result manager |
| MOM selection | Match result manager |
| Player match stats save | Match result manager |

Product impact: normal editors can help run the team data without being able to
change official match results.

### Dashboard And Rankings

| View | Data source | Notes |
| --- | --- | --- |
| Dashboard summary | `matches` | Record and score totals by selected season. |
| Dashboard stat cards | `player_match_stats` | Goals, assists, appearances, top output. |
| Match history | `matches` | Recent or selected-season match list. |
| Rankings | `player_match_stats` plus `players` | Public-safe player fields only. |

Design rule: derive dashboard and ranking data from stored records. Avoid
manually maintained summary fields unless there is a clear performance or
product reason.

## Public Data Policy

Public pages must not expose:

| Do not expose | Reason |
| --- | --- |
| Player birth date | Personal data. |
| Player contact details | Personal data. |
| Player or guest memo | Free text may contain private notes. |
| Player match stat memo | Free text may contain private notes. |

Inputs, displays, and writes for those fields have been removed from app code.
Apply `docs/database/supabase-security-cleanup.sql` to clear existing values to
`null`.

Future default: if the club later needs private contact details or notes, build
that as a separate editor-only feature with its own table, RLS policy, UI, and
verification checklist.

## Database Scripts

| File | Purpose | Current use |
| --- | --- | --- |
| `docs/database/supabase-schema.sql` | Main schema, triggers, formation seed data | Current reference. |
| `docs/database/supabase-rls.sql` | Public-read and approved-editor write policies | Current reference. |
| `docs/database/supabase-security-cleanup.sql` | Result permission setup and sensitive-value cleanup | Current reference. |
| `docs/database/supabase-guest-players.sql` | Guest-player migration reference | Historical support. |
| `docs/database/supabase-open-access.sql` | Open-access helper | Historical; not production policy. |

Before changing tables, RLS, Auth, editor access, environment keys, or
deployment security, review `docs/security.md`.

## Deployment Notes

| Area | Current note |
| --- | --- |
| Hosting | Vercel is connected. |
| Read access | Public read mode is intended. |
| Auth setup | Public sign-up should be disabled in Supabase Auth. |
| Security setup | RLS and security cleanup SQL should be applied and verified. |
| Checklist | See `docs/deployment/vercel.md`. |

## Maintenance Rules

When behavior changes, update the matching document:

| Change type | Update |
| --- | --- |
| Expected user behavior changes | `docs/specs/requirements.md` |
| Architecture, data flow, table responsibility, permission design changes | `docs/specs/design.md` |
| Access, RLS, Auth, private fields, deployment security changes | `docs/security.md` |
| Current status or next work changes | `docs/specs/progress.md` |
| Historical implementation detail grows | `docs/specs/progress-history.md` |

Recommended default for future work: keep public read access, approved-editor
write access, and separate match-result authority unless the product owner makes
an explicit product decision to change that model.
