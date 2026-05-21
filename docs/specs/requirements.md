# Product Requirements

This document records the current product behavior for SDR Team Manager. Detailed
security rules live in `docs/security.md`; implementation history lives in
`docs/specs/progress-history.md`.

## Product Goal

SDR Team Manager helps a small football club manage players, seasons, squads,
matches, period lineups, match results, player stats, rankings, and dashboard
summaries.

The app is currently intended to be publicly readable, while all data-changing
actions require an approved editor account.

Current UI planning treats lineup planning as the main pre-match workflow.
Approved editors should be able to open a top-level `라인업` area, select an
active-season match, and prepare period-by-period lineups before match day.

## Access Rules

- Logged-out visitors can view public team data.
- Signed-in users who are not in `public.team_editors` can view public team data
  but cannot edit.
- Approved editors can manage general team data.
- Only the owner, or an editor with `can_manage_match_results = true`, can edit
  match result data.
- Public sign-up should be disabled in Supabase Auth. Editor accounts are
  created by the owner/admin.
- If the product later changes to private access, logged-out visitors should be
  redirected to `/login`; signed-in unapproved users may still view data.

Match result data means:

- Scores.
- Match completion status.
- MOM selections.
- Player match stats: played, goals, assists, yellow cards, and red cards.

## Data Privacy

Public-read mode means the app must avoid publicly readable personal or
free-text internal data.

Current policy:

- Do not expose or use player birth dates.
- Do not expose or use player contact details.
- Do not expose or use player or guest memos.
- Do not expose or use player match stat memos.
- Existing values in these fields should be cleared to `null` during the next
  security cleanup.

If these fields become necessary later, design them as a separate editor-only
feature with explicit RLS protection.

## Player Management

- Players have a name, unique number, active/inactive status, and player type.
- `player_type` is either `member` or `guest`.
- New players default to `member` unless created as guests.
- Player numbers remain public because they are used for identification,
  lineups, rankings, and match records.
- Inactive players are excluded from new squad and lineup selection, but their
  historical records remain visible.

## Guest Players

- Guest players are stored in `players` with `player_type = 'guest'`.
- Lineups, stats, MOM selections, rankings, and reports continue to use
  `player_id`, not free-text guest names.
- Approved editors can add guests from the lineup screen.
- If no guest number is entered, the app assigns the next available 9000-range
  temporary number.
- A guest added from a lineup is also added to the current season squad.
- Guest players should be visually marked with a guest badge where members and
  guests appear together.
- Guest memo storage is deferred because the app currently uses public-read
  access.

## Season And Squad Management

- Seasons have a name, start date, end date, and active/inactive status.
- The end date must not be earlier than the start date.
- Active seasons can receive new matches.
- A squad links players to a season.
- Only active players can be newly added to squads.
- A player cannot be added to the same season squad twice.
- A player already used in that season's lineups should not be removable from
  the squad without an explicit product decision.

## Match Management

- Matches belong to seasons.
- Match creation requires season, opponent, match date, and home/away setting.
- Venue is optional.
- New matches should default to four periods: `1Q`, `2Q`, `3Q`, and `4Q`.
- Match creation should also allow a half-based mode: `전반`, `후반`.
- The match period mode may be changed only while the match has no saved lineup.
- Result is calculated from `our_score` and `opponent_score`; no separate result
  column should be stored.
- MOM fields are optional and reference players.
- Match score, completion status, and MOM selections require match-result
  authority.

## Periods And Lineups

- Matches are divided into periods.
- Each period can have one formation and one lineup.
- A lineup entry links period, formation slot, and player.
- A player cannot be assigned twice in the same period.
- A position slot cannot be assigned twice in the same period.
- The same player may play different positions in different periods.
- Lineup saving is available to normal approved editors because it is an
  operational workflow.
- Lineup planning should be available as a top-level `라인업` workflow for the
  active season.
- The top-level lineup workflow should show only active-season matches. Past
  season lineups remain available through season and match detail routes.
- The default lineup selection should be the nearest upcoming scheduled match;
  if there is no upcoming scheduled match, use the most recent completed match.
- Lineup changes should remain draft changes until the editor explicitly saves.
- If an editor tries to switch match or period with unsaved lineup changes, the
  app should ask for confirmation.
- The lineup UI should allow editing from both the pitch board and a
  position-ordered side panel.
- Replacing an occupied position should move the previous player to unassigned.
- Formation changes should keep matching position-code assignments and move
  unmatched players to unassigned after confirmation.
- Quarter-copy and per-period position fine-tuning are deferred.

## Formations

- Formations define named position slots with board coordinates.
- Built-in formations include 4-4-2, 4-3-3, and 3-5-2.
- Custom formations may be added by approved editors.
- Formations used by existing lineups should not be deleted.

## Player Match Stats

- Player match stats are per match and per player.
- Stats include played, goals, assists, yellow cards, and red cards.
- Goals, assists, yellow cards, and red cards must be zero or greater.
- Only players assigned in the match lineup can receive match stats.
- Player match stats require match-result authority.
- Free-text stat memos are deferred in public-read mode.

## Dashboard And Rankings

- The dashboard summarizes selected-season record, goals for/against, recent
  matches, and top player stats.
- Rankings are based on `player_match_stats`.
- Dashboard and ranking views should use public-safe player fields only.

## Source Of Truth

- Current status and next actions: `docs/specs/progress.md`.
- Security model and cleanup checklist: `docs/security.md`.
- Database scripts: `docs/database/`.
- Deployment checklist: `docs/deployment/vercel.md`.
- Historical detail: `docs/specs/progress-history.md`.
