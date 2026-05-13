# Handoff - SDR Team Manager

## Purpose Of This Handoff

The user invoked the local `handoff` skill with no extra arguments. This document is for a fresh agent to continue work in `D:\kk\backup\project\sdr-team-manager` without rereading the full conversation.

## Project Context

Follow `AGENTS.md` closely. The project owner is a non-developer with statistics/data-analysis experience, so explain product impact first, then technical details in plain language. For any meaningful completed work unit, update `docs/specs/progress.md` with what changed, how it was verified, current state, next steps, and remaining risk.

Core reference files now live under `docs/`:

- `docs/specs/progress.md`: best current source of implementation status and deployment/data risks.
- `docs/specs/tasks.md`: phased checklist, but note the Korean text appears mojibake/encoding-corrupted in terminal output. Avoid broad automated edits unless encoding is handled carefully.
- `docs/specs/design.md` and `docs/specs/requirements.md`: product and architecture decisions.
- `docs/deployment/vercel.md`: deployment checklist.
- `docs/database/supabase-schema.sql`, `docs/database/supabase-rls.sql`, `docs/database/supabase-guest-players.sql`: database scripts relevant to current live state.

## Current Repository State

`git status --short` before the docs restructure showed uncommitted skill/agent metadata changes:

- Modified: `skills-lock.json`
- Untracked: `.agents/skills/caveman/`
- Untracked: `.agents/skills/grill-me/`
- Untracked: `.agents/skills/handoff/`
- Untracked: `.agents/skills/tdd/`

Do not assume these are disposable; they are likely user-installed/local skill changes. Work with them and avoid reverting.

## Functional State To Trust

The app appears to have progressed through Phase 0-6 plus later guest-player and import work. `docs/specs/progress.md` records successful `npm.cmd run lint` and `npm.cmd run build` checks for the major implemented phases.

Most recent important product state:

- Public read access with approved-editor write access is the intended mode.
- Route protection is disabled so visitors can open the app directly.
- Editors must sign in and exist in `team_editors` to see/use write controls.
- Guest player support is implemented in code, but the live Supabase database must run `docs/database/supabase-guest-players.sql` before deployed guest creation/read paths are safe.
- `docs/database/supabase-rls.sql` is the current security script for public-read/approved-edit permissions and may still need to be applied in Supabase.
- Legacy 26-season stats import is prepared as `data/import/legacy-26-season-import.sql`; running it in Supabase SQL Editor is the safest path because anon-key API writes were blocked by RLS.

## Likely Next Work

Depending on the user's next ask, likely useful work includes:

- Deployment smoke test: confirm deployed Vercel URL opens without login, non-editors can browse only, and approved editors can sign in and save a small edit.
- Database follow-through: run or guide running `docs/database/supabase-guest-players.sql`, `docs/database/supabase-rls.sql`, and/or `data/import/legacy-26-season-import.sql` in Supabase SQL Editor.
- Mobile lineup smoke test: on a real phone browser, test dragging player cards into lineup slots, moving between slots, returning to bench, and saving.
- Encoding cleanup: investigate mojibake in `docs/specs/tasks.md` before editing Korean text.

## Verification Pattern

For code changes, prefer:

- `npm.cmd run lint`
- `npm.cmd run build`

Use `npm.cmd` in PowerShell because prior notes say plain `npm run ...` hit PowerShell `npm.ps1` execution policy issues.

## Skills Suggested For Next Session

- Use `handoff` again if the next session needs a compact continuation note.
- Use `tdd` if the next task is a bug fix or feature where validation rules/server actions should be protected by tests.
- Use `grill-me` only if the user asks to stress-test a plan or design choice.
- Use `caveman` only if the user explicitly asks for very terse output.
