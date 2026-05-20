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
- Match detail workflow actions.
- Mobile lineup interaction.
- Mobile dashboard match card.

### 1-A. Layout

- [ ] Keep desktop left navigation expanded with visible text.
- [ ] Use side-menu-based mobile navigation instead of bottom tabs.
- [ ] Move mobile login/logout/account-state display to the bottom of the side
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
- [ ] Show unsaved-changes state and provide discard/revert behavior.
- [ ] Put period selection near the top as visible button-like controls.
- [ ] Keep tab/button switching as a fallback if position-tap selection is not
      usable.
- [ ] Improve lineup save, validation, and error feedback where needed.

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
- [ ] Defer player-specific record views to a later player detail or `통계`
      decision.
- [ ] Review season list and season detail.
- [ ] Review match list and match detail.
- [ ] Use compact match cards for mobile match lists.
- [ ] Use sports-app references for mobile match-card structure only, without
      adding bottom-tab navigation.
- [ ] Review player match stats entry.
- [ ] Review ranking screen.

## Deferred Decisions

- [ ] Keep expanded statistics as a later `통계` menu or section decision.
- [ ] Use `순위` for the current ranking screen/menu.
- [ ] Reconsider whether `순위` belongs under a future `통계` area after that
      area is designed.
- [ ] Clarify whether player-specific record screens are needed.
- [ ] Verify mobile lineup dragging on a real phone browser.
- [ ] Verify new mobile lineup bottom-sheet flow on a real phone browser.

## Wording Cleanup

- [ ] Review major navigation labels.
- [ ] Review form labels and button text.
- [ ] Review empty states and validation messages.
- [ ] Use Korean-first wording while preserving natural football terms such as
      `라인업`, `MOM`, and `스쿼드`.
- [ ] Use `기록` for data entry and `통계` for aggregated analysis.
- [ ] Reduce awkward or unnecessary Korean/English mixing.

## Verification

- [ ] Run `npm.cmd run lint` after implementation changes.
- [ ] Run `npm.cmd run build` after implementation changes.
- [ ] Check mobile viewport behavior after layout changes.
- [ ] Check logged-out public view after account UI changes.
- [ ] Check approved-editor and result-manager workflows when test accounts are
      available.
