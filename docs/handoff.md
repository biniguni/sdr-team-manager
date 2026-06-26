# Handoff

This is an ephemeral continuation note. The durable sources of truth are:

- Current status: `docs/specs/progress.md`
- Product behavior: `docs/specs/requirements.md`
- Technical design: `docs/specs/design.md`
- Security model: `docs/security.md`
- UI planning: `docs/specs/ui/`
- Database guide: `docs/database/README.md`

## Current App State

- Stack: Next.js App Router, TypeScript, Tailwind CSS, Supabase, Vercel.
- Access mode: public read, approved-editor write.
- Editors sign in at `/login`; `team_editors` controls write access.
- Match result authority is separate through `can_manage_match_results`.
- Global login blocking is intentionally disabled in `src/proxy.ts`.
- Vercel has been connected by the owner.

## Current Product Behavior

- Dashboard summarizes selected-season record, recent form, latest 7 matches,
  team composition, and personal key stats.
- `/lineup` is the central active-season lineup workflow.
- Lineup flow:
  - select active-season match,
  - add season-squad players to that match roster,
  - optionally add match-only guests,
  - assign match-roster participants to period lineups.
- Match-only guests are stored only in `match_roster` with `guest_name` and
  optional `guest_number`.
- Guests are visually marked with compact indicators in lineup player cards so
  mobile names remain readable.
- Guest stats, guest MOM, guest ranking, and guest dashboard reporting are not
  implemented; current reporting remains registered-player based.
- `/ranking` keeps the ranking table as the primary view.
- Ranking table columns are:
  `순위`, `선수`, `등번호`, `출전`, `득점`, `도움`, `MOM`.
- Ranking table MOM uses only overall match MOM
  (`matches.match_mom_player_id`), not defense/midfield/attack MOM.
- Clicking a player name in Ranking opens a modal-style personal record view.
- Ranking personal detail includes:
  - summary cards: 출전, 승률, 득점, 도움, 무실점, MOM,
  - trend tabs: 출전수, 득점, 도움,
  - position analysis,
  - opponent records.
- Ranking personal detail intentionally excludes season insight and rating
  sections because rating data does not exist.

## Database And Security

- Supabase RLS/security cleanup was reported applied by the owner.
- Public sign-up was handled in Supabase Auth.
- Owner has `can_manage_match_results = true`.
- Sensitive/free-text fields are removed from app code and were cleared through
  SQL cleanup.
- For existing DBs, apply `docs/database/supabase-match-roster.sql` if missing:
  - `match_roster`,
  - `match_roster.guest_name`,
  - `match_roster.guest_number`,
  - `period_lineups.match_roster_id`,
  - `4-2-3-1` seed data.
- Use `docs/database/supabase-schema.sql` only for a fresh DB.

## Recent Verification

- `npm.cmd run lint` passed after the latest Ranking modal/table changes.
- `npm.cmd run build` passed after the latest Ranking modal/table changes.
- `git diff --check` passed; only line-ending warnings were reported.
- `npm.cmd run dev` works in the foreground and reports `http://localhost:3000`.
- Background dev-server launch may fail in this environment because PowerShell
  `Start-Process` hits a PATH-key conflict.

## Immediate Next Actions

1. Review `/ranking` visually:
   - table columns,
   - player-name click behavior,
   - modal scroll behavior,
   - chart tabs,
   - position analysis,
   - opponent records.
2. Review `/lineup` on desktop against
   `reference/left_menu_and_lineup_sample.png`.
3. Verify on a real phone:
   - mobile lineup dragging,
   - enlarged lineup capture view,
   - outside-tap mobile menu close,
   - compact guest indicators,
   - Ranking detail modal.
4. Add normal editor accounts later and verify:
   - normal editor can manage general records and lineups,
   - normal editor cannot write scores, MOM, completion, or player stats,
   - owner/result manager can write result data.
5. Build the full calendar-style 경기 일정 screen after the owner provides the
   FM reference.
6. Leave root `CHANGELOG.md` for release/deployment notes after the next actual
   deployment. It is currently stale relative to match-only guest behavior.

## Cautions

- Do not enable global login redirects while public-read mode remains the
  product decision.
- Do not reintroduce public birth date, contact, player memo, guest memo, or
  player-stat memo usage.
- Do not convert match-only guests into registered players unless the product
  decision changes.
- Do not restart historical migration work yet. If migration resumes, prepare
  reliable match, period, player, and position-code data first.
- Before changing more UI copy, check `docs/specs/ui/copy-review.md`; use the
  `Owner change` column as final wording where it exists.
