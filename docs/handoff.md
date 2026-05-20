# Handoff - SDR Team Manager

This is the next-session brief. Historical detail belongs in
`docs/specs/progress-history.md`; current status belongs in
`docs/specs/progress.md`.

## Project Context

- Repository: `D:\kk\backup\project\sdr-team-manager`
- Owner context: explain product impact first, then implementation details in
  plain language.
- Current operating mode: public read access, approved-editor write access.
- Global login blocking is intentionally disabled. Do not turn `src/proxy.ts`
  into a logged-out redirect unless the product decision changes to private
  access.
- The owner is non-developer and wants UI improvement to proceed through
  questions, sketches, and Figma review before implementation.

## Current App And Database State

- Phase 0-6 app foundation is implemented.
- Vercel is connected by the project owner.
- Security cleanup has been implemented in app code and applied in Supabase for
  the current owner workflow.
- `team_editors.can_manage_match_results` exists and owner is set to `true`.
- Public-read mode remains active.
- Sensitive/free-text fields were removed from app usage and cleared to `null`.
- Logged-out write blocking was verified by the owner.
- Sensitive/memo fields disappearing from deployed UI was verified by the owner.

## Current UI Planning State

- UI planning docs live in `docs/specs/ui/`:
  - `docs/specs/ui/requirements.md`
  - `docs/specs/ui/design.md`
  - `docs/specs/ui/tasks.md`
- Use the `grill-me` skill for one-question-at-a-time planning when more product
  clarification is needed. If a question can be answered from the app or
  codebase, inspect that first.
- Mobile usability and overall visual/layout cleanup are equal top priorities.
- Web and mobile should keep the same dark visual theme; differences should be
  layout, ordering, and collapsed/expanded behavior.
- Football Manager is a structural reference for tactics/lineup and football
  management workflows, not a visual design to copy.
- Sports app references may inform mobile match cards only; do not add bottom
  tabs or a separate mobile theme.

## Key UI Decisions

- Desktop layout:
  - left navigation stays expanded with visible text,
  - central work area is dominant,
  - right-side panel is optional and only used when helpful.
- Mobile layout:
  - side-menu-based navigation, not bottom tabs,
  - account/login/logout state belongs at the bottom of the side menu,
  - screen-specific primary actions should be large tap targets in the work
    area.
- Match detail workflow:
  - primary action order is lineup assignment, match result entry, then player
    match stats entry,
  - on mobile, show these actions directly below the match summary as large
    buttons,
  - public viewers should still see useful read-only routes; edit-only actions
    should show clear permission-needed states.
- Mobile lineup:
  - default view is the tactics board,
  - tapping a position opens a bottom-sheet player selector,
  - occupied positions can be replaced or cleared from the same sheet,
  - selecting a player closes the sheet automatically,
  - player list order is unassigned first, then number/name,
  - already assigned players remain visible but clearly marked,
  - changes are not auto-saved; user taps save to commit,
  - show unsaved-changes state and provide discard/revert behavior,
  - period selection should be visible near the top as button-like controls,
  - desktop lineup assignment remains drag-and-drop only,
  - mobile may still support drag movement inside the tactics board where
    reliable,
  - dedicated substitutes management is deferred.
- Mobile dashboard:
  - top card prioritizes upcoming scheduled matches,
  - show schedules even if the opponent is undecided,
  - undecided opponent label is `상대 미정`,
  - if no upcoming match exists, show the most recent match,
  - match-card action is a single `경기 열기` button.
- Wording:
  - Korean-first labels and messages,
  - keep natural football terms such as `라인업`, `MOM`, and `스쿼드`,
  - use `기록` for entered match/player data,
  - use `통계` for aggregated analysis,
  - keep `순위` as the current ranking screen/menu; reconsider under a future
    `통계` area later.

## First Implementation Scope

Implement Phase 1 from `docs/specs/ui/tasks.md` after Figma review:

1. Overall layout cleanup.
2. Match detail workflow actions.
3. Mobile lineup interaction.
4. Mobile dashboard match card.

Phase 2 and deferred work include permission polish, player list/mobile rows,
season and match list improvements, expanded `통계`, wording cleanup, and
real-phone lineup verification.

## Figma Next Step

- The owner prefers connecting Figma before Phase 1 implementation.
- Preferred connection path is Codex CLI MCP because the owner may later package
  MCP setup into a personal plugin.
- Official CLI setup command:

```powershell
codex.cmd mcp add figma --url https://mcp.figma.com/mcp
```

- If authentication is required:

```powershell
codex.cmd mcp login figma
```

- Confirm setup:

```powershell
codex.cmd mcp list
```

- Suggested Figma file name: `SDR Team Manager UI Phase 1`.
- Suggested frames:
  - `Desktop - App Layout`
  - `Desktop - Match Detail`
  - `Desktop - Lineup`
  - `Mobile - Dashboard`
  - `Mobile - Side Menu`
  - `Mobile - Match Detail`
  - `Mobile - Lineup Board`
  - `Mobile - Player Bottom Sheet`

## Verification Already Done

- `npm.cmd run lint` passed after the security cleanup code changes.
- `npm.cmd run build` passed after the security cleanup code changes.
- `git diff --check` passed with only line-ending warnings.

## Remaining Verification

- General editor behavior is not verified yet because real editor accounts will
  be added later.
- Mobile lineup dragging still needs real-phone verification.
- Future UI implementation should run:
  - `npm.cmd run lint`
  - `npm.cmd run build`
  - mobile viewport checks
  - logged-out public view checks

## Cautions

- Do not commit secrets or service role keys.
- Keep Supabase service role keys out of browser code and Vercel public env vars.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser
  public values; RLS must protect the database.
- Some Korean text in terminal output can appear as mojibake. Prefer UTF-8 reads
  when checking docs, for example `Get-Content -Raw -Encoding UTF8 ...`.
