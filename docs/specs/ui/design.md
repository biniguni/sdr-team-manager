# UI Design

This document records screen structure, design direction, references, and
decisions made during UI planning.

## Design Principles

- Keep the app operational and practical rather than marketing-like.
- Preserve the current dark overall theme.
- Prioritize mobile workflows that happen during or around matches.
- Keep dense information scannable on desktop.
- Make primary actions easy to see and tap on mobile.
- Treat match detail, lineup assignment, and player match stats as one connected
  workflow rather than isolated pages.
- Keep web and mobile visually consistent. Mobile references are for layout and
  interaction patterns only, not for changing the color theme, background, or
  overall mood.
- Use clear account and permission signals where editing actions appear.
- Prefer simple, familiar controls over custom interactions when mobile
  usability is uncertain.
- Keep public-read and approved-editor behavior visible but unobtrusive.

## Design Review Workflow

Figma is deferred for now because the owner is on Figma Starter and the MCP
workflow does not provide enough practical value for the current implementation
pass.

Current review workflow:

- Use `reference/left_menu_and_lineup_sample.png` as the concrete desktop lineup
  structure reference.
- Review implemented screens directly in the local browser.
- Check desktop and mobile viewport sizes before treating UI work as complete.
- Record product decisions in this document and concrete implementation work in
  `docs/specs/ui/tasks.md`.
- Do not block useful implementation work on pixel-perfect Figma designs.

## Reference Direction

- Football Manager can be used as a structural reference for football-management
  workflows, information hierarchy, and navigation ideas.
- Do not copy Football Manager's exact visual design. Use it only to understand
  useful patterns for squad, tactics, match, and stats screens.
- `reference/left_menu_and_lineup_sample.png` is the current concrete layout
  reference for desktop: left-side menu, central lineup/tactics pitch, and a
  dense supporting player/selection panel.

## Primary Layout Targets

- Overall app layout.
- Tactics and lineup screens.
- Dashboard refinement based on the current dashboard.
- Player-specific records are not designed yet.

## App Layout

## Visual Direction

- Keep the current dark app theme.
- Make tactics and lineup pitch areas feel more clearly like a football field.
- Keep button and accent colors consistent across screens.
- Do not switch mobile to a separate light theme.

## Wording

- Use Korean-first labels for user-facing navigation, buttons, forms, empty
  states, and validation messages.
- Keep natural football terms where they are clearer than forced translation,
  such as `라인업`, `MOM`, and `스쿼드`.
- Use `기록` for entered match/player data, such as goals, assists, cards, and
  player match entry.
- Use `통계` for aggregated analysis, summaries, and later expanded statistics.
- Keep the current ranking area as `순위` for the first UI pass. If a broader
  `통계` area is added later, reconsider whether `순위` should become part of it.
- Avoid mixed-language labels unless the mixed term is already natural for the
  target users.

### Desktop

- Use a left primary navigation area and a central work area.
- Keep the desktop left navigation expanded with visible text.
- Desktop navigation order:
  `Dashboard`, `라인업`, `Seasons`, `Players`, `Formations`, `Ranking`.
- Keep `Formations` as a top-level item for the first UI pass because lineup
  work still depends on formation management and there is no settings area yet.
- Keep the central work area dominant, especially for tactics and lineup
  screens.
- Treat a right-side panel as optional. Use it for player lists, selection
  details, recent context, or secondary information only when it improves the
  workflow.
- For lineup/tactics, use the reference image as a structural guide: persistent
  left menu, large central pitch board, compact top context/actions, and a dense
  player/slot panel beside the pitch when there is enough space.
- Football Manager's tactics screen is a useful reference for structure: left
  navigation, clear top context, central tactics board, and dense supporting
  data where needed.

### Mobile

- Use a simpler structure than desktop.
- Top: current screen context.
- Center: main work area.
- Primary navigation should use a side menu rather than bottom tabs.
- Mobile side-menu order should match desktop:
  `Dashboard`, `라인업`, `Seasons`, `Players`, `Formations`, `Ranking`.
- Screen-specific primary actions should be visible in the work area as large
  tap targets.
- Account/login/logout state should live at the bottom of the side menu rather
  than always occupying top-bar space.
- Convert optional desktop side panels into tabs, drawers, accordions, or
  stacked sections.
- For player selection and lineup-related lists, use a dense row-list pattern:
  left visual identifier, central player details, and right-aligned summary
  values.
- Keep each mobile row large enough to tap comfortably.
- Prefer visible separators and strong hierarchy over decorative cards for
  dense selection lists.
- Preserve the same color system, background treatment, and general mood as the
  desktop web UI.
- Sports app references can inform mobile match cards and schedule summaries,
  but do not introduce bottom-tab navigation or a separate visual theme.

## Screen Notes

### Dashboard

- Current problem:
- Desired direction: Reuse and refine the existing dashboard direction rather
  than replacing it completely. Keep the current information, improve scan
  quality, and add faster movement into match work such as match detail, lineup,
  and stats entry.
- Mobile considerations:
- Mobile considerations: Mobile dashboard may use compact match cards and
  schedule-style summaries inspired by sports apps, while keeping the app's dark
  theme and side-menu navigation.
- Permission/account considerations:
- Review reference:
- Decisions:
  - Dashboard should focus on current information cleanup and quick movement
    into match workflows.
  - Mobile dashboard should start with an upcoming or most recent match card.
  - Upcoming matches should take priority on the mobile dashboard. If an
    upcoming schedule exists, show it even when the opponent is not decided yet.
    If there is no upcoming match, show the most recent match.
  - Show undecided opponents as `상대 미정`.
  - Keep the mobile dashboard match-card action simple: use a single `경기 열기`
    button and let match detail handle lineup/result/stats actions.
  - Expanded statistics should be considered as a separate menu or section later,
    not forced into the dashboard first pass.
  - If expanded statistics become a separate menu later, name it `통계`.

### Players

- Current problem:
- Desired direction: First pass should clean up the player-management list for
  easier scanning and editing.
- Mobile considerations: Use a tap-friendly row-list layout rather than a dense
  desktop table.
- Permission/account considerations:
- Review reference:
- Decisions:
  - Player list first pass is management-focused: add, edit, deactivate, and
    check core player identity.
  - Player-specific record views are deferred and may later belong in player
    detail or the `통계` area.
  - Mobile player list should use rows with a clear left identity marker, central
    player details, and right-side status/action cues.

### Seasons

- Current problem:
- Desired direction:
- Mobile considerations:
- Permission/account considerations:
- Review reference:
- Decisions:

### Matches

- Current problem:
- Desired direction:
- Mobile considerations: Use compact match cards rather than dense tables. Cards
  should show opponent, date/time, status or score, and quick movement into
  match detail or related work where appropriate.
- Permission/account considerations:
- Review reference:
- Decisions:
  - Mobile match list first pass should use small match cards.
  - Sports live-score style references are acceptable for card structure only;
    do not adopt their bottom-tab navigation.

### Match Detail

- Current problem: Navigation from match detail to lineup and player match stats
  feels uncomfortable. Important buttons are too small or hard to notice,
  especially on mobile.
- Desired direction: Make the match workflow obvious and reduce the effort to
  move between match detail, lineup, and stats entry.
- Mobile considerations: Primary workflow buttons must be large enough to tap
  comfortably and visible without hunting through the page.
- Permission/account considerations: Do not hide the workflow completely from
  public viewers. Allow read-only views where useful, and show clear
  permission-needed states for actions that require editing.
- Review reference:
- Decisions:
  - Primary workflow button order should be: lineup assignment, match result
    entry, then player match stats entry.
  - On mobile, show the three primary workflow buttons directly below the match
    summary so they are visible without hunting through the page.
  - For users without edit permission, keep useful read-only routes visible and
    clearly mark edit-only actions as requiring permission.

### Lineup

- Current problem: The lineup page is part of the uncomfortable match workflow,
  and mobile drag usability still needs verification.
- Desired direction: Treat lineup as the main pre-match planning workflow, not
  only as a secondary link from match detail. A top-level `라인업` menu should
  open the active season's lineup planning screen.
- Desktop direction: follow the provided lineup sample structure at a product
  level: keep navigation on the left, make the pitch the main working area, and
  place player selection/status controls in a dense supporting panel.
- Active-season route behavior:
  - Show only active-season matches in the top-level `라인업` screen.
  - Past-season lineups remain available through season detail, match detail,
    then lineup.
  - Match detail should link to the central lineup screen with the selected
    match, for example `/lineup?matchId=...`, so lineup editing has one primary
    UI.
  - At the top of the lineup screen, show compact horizontally scrollable match
    cards. Scheduled matches appear first; completed matches follow.
  - Default to the nearest upcoming scheduled match. If there is no upcoming
    match, default to the most recent completed match.
  - If there is no active season, show an empty state that sends the user to the
    season screen. If the active season has no matches, show an empty state that
    sends the user to that season's match creation screen.
- Period behavior:
  - Default new matches to `1Q`, `2Q`, `3Q`, `4Q`.
  - Allow a `전반`, `후반` mode when creating a match.
  - Allow changing between 4-quarter and half modes only before any lineup is
    saved for that match.
  - Show the selected match's periods as visible button-like controls.
- Editing behavior:
  - Lineup changes are draft-only until the user clicks save.
  - Show an unsaved-changes state and provide a revert/discard action.
  - Place unsaved status, revert, and save controls on the right side of the
    selected match/period control area.
  - If the user tries to switch match or period with unsaved changes, show a
    confirmation that lets them continue editing or move without saving.
  - Include secondary links in the selected-match summary for match detail,
    result entry, and player match stats. These links should not compete with
    the lineup editing controls.
  - The right-side panel should show assigned positions in formation order, with
    unassigned players below.
  - Editing should work from both the central pitch board and the right-side
    position/player panel.
  - Assigning a player to an occupied position moves the previous player to
    unassigned.
  - Assigning a player who is already used elsewhere clears that previous
    position, so one player appears only once per period.
  - When the formation changes, keep assignments with matching position codes
    and move unmatched assignments to unassigned after confirmation.
- Mobile considerations: Dragging must be verified on a real phone; if it is not
  comfortable, design a fallback selection flow. Player selection should use a
  row-list pattern with clear player identity, core details, and right-aligned
  summary values.
- Permission/account considerations:
- Review reference:
- Decisions:
  - Mobile lineup should preserve the same visual theme as desktop.
  - Mobile lineup defaults to the tactics board.
  - When the user taps a position, show the player-selection list in a bottom
    sheet.
  - Tapping an occupied position should open the same bottom sheet and allow the
    user to replace the player or clear the position.
  - Desktop lineup should use drag-and-drop only for player assignment and
    movement.
  - Mobile lineup should use the bottom sheet for choosing/replacing players,
    while still allowing drag-and-drop movement inside the tactics board where
    it is reliable.
  - After selecting a player in the mobile bottom sheet, close the sheet
    automatically so the user can review the tactics board.
  - Dedicated substitutes management is deferred. Focus the first lineup pass on
    period lineup assignment and movement.
  - Initial player list ordering should prioritize players not yet assigned in
    the current period, then sort by number/name.
  - Already assigned players may remain visible but must be clearly marked as
    already assigned.
  - Position-experience-based recommendations can be added later when the data
    and UI need are clearer.
  - Mobile lineup changes should not auto-save. The user should explicitly tap a
    save button to commit changes.
  - Show a clear unsaved-changes state and provide a way to discard or revert
    pending changes.
  - Period selection should be visible near the top as button-like controls, not
    hidden in a dropdown.
  - A tab or button switch between tactics board and player list remains a
    fallback option only if the position-driven bottom-sheet flow is not usable.
  - Quarter-copy is deferred.
  - Per-period position fine-tuning is deferred because it needs schema support,
    such as lineup-level custom coordinates.

### Player Match Stats

- Current problem: Stats entry is too hard to reach from match detail, especially
  on mobile.
- Desired direction: Make stats entry feel like the next obvious action after
  lineup or match completion.
- Mobile considerations: Buttons and form controls must be easy to tap and scan.
- Permission/account considerations:
- Review reference:
- Decisions:

### Ranking

- Current problem:
- Desired direction:
- Mobile considerations:
- Permission/account considerations:
- Review reference:
- Decisions:
  - Use `순위` as the current menu/screen label.
  - Reconsider integration into a later `통계` area only after that area is
    designed.

### Login And Account State

- Current problem:
- Desired direction:
- Mobile considerations: Do not keep account state permanently visible in the
  mobile top bar. Place login/logout/account state at the bottom of the side
  menu to preserve working space.
- Permission/account considerations:
- Review reference:
- Decisions:
  - Mobile account state belongs at the bottom of the side menu.
  - Because account state is not always visible, edit-only controls need clear
    permission-needed states where they appear.
  - Mobile navigation should be side-menu based rather than bottom-tab based.
