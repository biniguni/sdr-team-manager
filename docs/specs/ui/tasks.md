# UI Tasks

This checklist tracks UI improvement planning and implementation. Keep product
questions in `requirements.md`, screen decisions in `design.md`, and concrete
work items here.

## Planning

- [x] Create UI spec folder under `docs/specs/ui/`.
- [x] Create UI requirements, design, and task documents.
- [x] Record that mobile usability and overall layout cleanup are equal top
      priorities.
- [x] Record current discomfort around match detail, lineup, and player stats
      navigation.
- [x] Record primary planning targets: overall app layout, tactics/lineup,
      dashboard refinement, and undecided player-specific records.
- [x] Record desktop layout direction: left navigation, central work area, and
      optional right-side panel.
- [x] Record owner-provided lineup reference:
      `reference/left_menu_and_lineup_sample.png`.
- [x] Record mobile player-selection reference: dense tap-friendly row list.
- [x] Record that web and mobile should share the same visual theme; only layout
      should adapt.
- [x] Record visual direction: keep current dark theme and improve football
      pitch treatment in tactics/lineup screens.
- [x] Confirm first implementation scope.
- [ ] Review current app screens before implementation.
- [ ] Record any implementation discoveries back into `requirements.md` or
      `design.md` if they affect product behavior.

## Phase 1: First UI Implementation Pass

First pass scope:

- Overall layout cleanup.
- Korean UI copy cleanup.
- Match detail workflow actions.
- Mobile lineup interaction.
- Mobile dashboard match card.

### 1-A. Layout

- [x] Keep desktop left navigation expanded with visible text.
- [x] Reorder desktop navigation to `Dashboard`, `라인업`, `Seasons`,
      `Players`, `Formations`, `Ranking`.
- [ ] Rename desktop navigation to Korean labels:
      `대시보드`, `라인업`, `시즌`, `선수`, `포메이션`, `순위`.
- [ ] Use the owner-provided lineup sample as the desktop structure reference:
      left menu, central pitch board, and dense supporting player controls.
- [x] Add `라인업` as a top-level left-menu item.
- [x] Keep `Formations` as a top-level menu for the first UI pass.
- [x] Use side-menu-based mobile navigation instead of bottom tabs.
- [x] Reorder mobile side-menu navigation to match desktop.
- [ ] Rename mobile side-menu navigation to match the Korean desktop labels.
- [x] Move mobile login/logout/account-state display to the bottom of the side
      menu.
- [ ] Preserve the current dark theme across web and mobile.

### 1-B. Match Detail Workflow

- [ ] Put match-detail primary actions in this order: lineup assignment, match
      result entry, player match stats entry.
- [ ] On mobile match detail, place the three primary actions directly below the
      match summary as large tap targets.
- [ ] For public viewers, keep useful read-only match workflow routes visible and
      mark edit-only actions as requiring permission instead of hiding the whole
      workflow.

### 1-C. Mobile Lineup

- [x] Create a top-level `라인업` route for active-season lineup planning.
- [x] Show only active-season matches on the top-level lineup route.
- [x] Keep past-season lineup access through season/match detail routes.
- [x] Show top match selection as compact horizontally scrollable match cards.
- [x] Default selected match to the nearest upcoming scheduled match, falling
      back to the most recent completed match.
- [x] Add empty states for no active season and active season with no matches.
- [x] Change new-match period defaults to `1Q`, `2Q`, `3Q`, `4Q`.
- [x] Add match period mode selection for `4쿼터` or `전후반`.
- [ ] Block period mode changes after any lineup exists for that match.
- [x] Update match-detail `Lineup` links to open `/lineup?matchId=...`.
- [x] Keep the old deep lineup route only as compatibility or redirect if
      needed.
- [ ] Keep desktop lineup assignment drag-and-drop only.
- [ ] Design position-tap player selection: default tactics board, tap a
      position, then show player list in a bottom sheet.
- [ ] Support mobile drag-and-drop movement inside the tactics board where
      reliable.
- [ ] Close the mobile bottom sheet automatically after player selection.
- [ ] Support occupied-position actions in the bottom sheet: replace player and
      clear position.
- [ ] Defer dedicated substitutes management until after the first lineup UI
      pass.
- [ ] Order mobile bottom-sheet players by unassigned first, then number/name.
- [ ] Clearly mark players already assigned in the current period.
- [ ] Keep mobile lineup changes pending until the user taps save.
- [x] Show unsaved-changes state and provide discard/revert behavior.
- [x] Place unsaved status, revert, and save controls on the right side of the
      selected match/period control area.
- [x] Confirm before switching match or period when unsaved changes exist.
- [x] Add secondary selected-match links for match detail, result entry, and
      player match stats without making them the main focus.
- [x] Put period selection near the top as visible button-like controls.
- [ ] Keep tab/button switching as a fallback if position-tap selection is not
      usable.
- [ ] Improve lineup save, validation, and error feedback where needed.
- [x] Add a desktop right-side lineup panel ordered by formation/position, with
      unassigned players below assigned positions.
- [x] Allow editing from the right-side lineup panel as well as the pitch board.
- [x] Move the previous player to unassigned when replacing an occupied
      position.
- [x] Keep one-player-per-period-position rules clear in the UI.
- [x] On formation change, keep matching position-code assignments and move
      unmatched players to unassigned after confirmation.
- [x] Defer quarter-copy.
- [x] Defer per-period position fine-tuning.

### 1-D. Mobile Dashboard

- [ ] Review dashboard layout while preserving the current dashboard direction.
- [ ] Start the mobile dashboard with an upcoming or most recent match card.
- [ ] Prioritize upcoming scheduled matches on the mobile dashboard, even if the
      opponent is undecided; fall back to the most recent match.
- [ ] Display undecided opponents as `상대 미정`.
- [ ] Use a single `경기 열기` action on the mobile dashboard match card.
- [ ] Add or improve dashboard movement into match detail, lineup, and stats
      entry where appropriate.

## Phase 2: Follow-Up UI Pass

- [ ] Add clearer cues for public viewer, approved editor, and result-manager
      authority.
- [ ] Improve empty or blocked edit states so users understand why saving is
      unavailable.
- [ ] Verify owner/result-manager controls remain restricted to authorized
      users.
- [ ] Review player list and player forms.
- [ ] Keep player list focused on management clarity.
- [ ] Use a tap-friendly row-list layout for mobile player lists.
- [x] Keep player-specific record review in the Ranking detail modal for now.
- [ ] Review season list and season detail.
- [ ] Review match list and match detail.
- [ ] Use compact match cards for mobile match lists.
- [ ] Use sports-app references for mobile match-card structure only, without
      adding bottom-tab navigation.
- [ ] Review player match stats entry.
- [x] Review and update ranking screen:
  - table columns are rank, player, number, appearances, goals, assists, MOM,
  - table excludes win rate and clean sheets,
  - player-name click opens a modal-style personal detail view,
  - personal detail includes summary cards, trend tabs, position analysis, and
    opponent records,
  - season insight and rating sections are omitted because rating data does not
    exist.
- [ ] Verify the ranking detail modal on a real phone browser.

## Deferred Decisions

- [ ] Keep expanded statistics as a later `통계` menu or section decision.
- [x] Use `순위` for the current ranking screen/menu.
- [ ] Reconsider whether `순위` belongs under a future `통계` area after that
      area is designed.
- [ ] Clarify whether player-specific record screens are needed.
- [ ] Verify mobile lineup dragging on a real phone browser.
- [ ] Verify new mobile lineup bottom-sheet flow on a real phone browser.

## Wording Cleanup

- [ ] Search `src/` for remaining user-facing English UI copy.
- [ ] Classify found copy by screen: navigation, dashboard, players, seasons,
      matches, lineup, player records, ranking, login/account, permissions, and
      empty states.
- [ ] Review major navigation labels.
- [ ] Rewrite page titles and title subtitles in natural Korean.
- [ ] Review form labels and button text.
- [ ] Review empty states and validation messages.
- [ ] Use Korean-first wording while preserving natural football terms such as
      `라인업`, `MOM`, and `스쿼드`.
- [ ] Use `기록` for data entry and `통계` for aggregated analysis.
- [ ] Reduce awkward or unnecessary Korean/English mixing.
- [ ] Verify translated text does not overflow buttons, cards, tables, side
      menus, or mobile bottom sheets.

## Verification

- [x] Run `npm.cmd run lint` after implementation changes.
- [x] Run `npm.cmd run build` after implementation changes.
- [ ] Check mobile viewport behavior after layout changes.
- [ ] Check logged-out public view after account UI changes.
- [ ] Check approved-editor and result-manager workflows when test accounts are
      available.
