# Guest Player Support

## Product Decision

Guest players are stored as normal `players` records with `player_type = 'guest'`.
This keeps lineups, MOM selections, match stats, rankings, and future reports on
the same `player_id` data model as regular members.

## Data Rules

- `players.player_type` is `member` or `guest`, defaulting to `member`.
- `players.memo` stores optional operational context such as referral, role, or first participation note.
- Guest players still use `players.number` because the current schema requires a unique number.
- If no guest number is provided, the app assigns the next available 9000-range temporary number.
- A guest added from a lineup is inserted into both `players` and the current season's `squad_members`.
- `period_lineups` and `player_match_stats` continue to store `player_id`, never free-text guest names.

## UI Rules

- Approved editors can add a guest from the lineup screen with `+ 용병 추가`.
- Newly added guests can be dragged into formation slots like regular players.
- Guests assigned in a lineup are eligible for match stat entry.
- Guest players display a `용병` badge in mixed player lists, lineup cards, stats forms, rankings, and related controls.

## Deployment Note

The live Supabase `players` table has been checked by the project owner and already includes
`player_type` and `memo`.

Keep `docs/database/supabase-guest-players.sql` as the reference migration for any other database
that still has the original `players` table without guest-player columns.
