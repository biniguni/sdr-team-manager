# UI Requirements

This document captures what the UI improvement work should achieve from the
user's point of view. Implementation details belong in `design.md` and
`tasks.md`.

## Goals

- Make the app easier to use on mobile during real team-management work.
- Make the whole app cleaner, easier to scan, and more consistent across
  screens.
- Make login, logout, and account state clear without changing public-read
  access.
- Make editor permissions understandable before a user tries to save.
- Treat lineup planning as a top-level pre-match workflow, not just an action
  nested under match detail.
- Improve lineup, match, player, dashboard, and record-entry screens without
  changing the current database or security model unless a later product
  decision explicitly requires it.
- Clean up awkward wording and mixed-language labels.

## Current Product Decisions

- Public read access remains active.
- Approved-editor write access remains active.
- Global logged-out blocking remains disabled.
- Editors sign in through `/login`.
- Match-result writes remain limited to owner/result-manager authority through
  `can_manage_match_results`.
- UI planning should happen through questions, sketches, local browser review,
  and practical screen iteration.
- Figma is deferred for now because the owner's current Figma Starter setup does
  not make MCP-based review useful enough to block implementation.
- Mobile usability and overall visual/layout cleanup are equal top priorities.
  Do not treat one as secondary unless a specific screen forces a tradeoff.

## Current Problems To Clarify

- Mobile login/logout/account-state display is not polished.
- Owner/editor/result-manager permission cues are not clear enough in the UI.
- Mobile lineup dragging needs real-phone verification.
- Some labels and button text need wording cleanup.
- The highest-priority screens for UI improvement are not fully ranked yet.
- The current navigation from match detail to lineup and player match stats is
  uncomfortable, especially on mobile.
- Lineup planning is too deeply nested for the real workflow, because lineups
  are usually prepared before match day.
- Important action buttons are too small or hard to notice on mobile.
- Mobile player selection should feel like a clear dense list, not a cramped
  desktop table.
- User-facing labels, buttons, and help text should be Korean-first. Natural
  football terms such as `라인업`, `MOM`, and `스쿼드` may remain as-is.

## Scope

- Dashboard
- Player list and player forms
- Season list and season detail
- Match list and match detail
- Lineup assignment
- Player match stats entry
- Ranking screen
- Login, logout, account state, and permission cues
- Mobile navigation and mobile-first layout issues

## Priority Areas

- Overall app layout is a primary planning target.
- Tactics and lineup screens are primary planning targets.
- `라인업` should be a top-level route focused on the active season.
- The top-level lineup route should show active-season matches as compact
  horizontal cards, defaulting to the nearest upcoming scheduled match.
- Dashboard should build on the existing dashboard rather than start from a
  blank design.
- Dashboard should keep current summary information while helping users move
  quickly into match workflows.
- Expanded statistics should be considered separately from the first dashboard
  cleanup, likely as a separate `통계` menu or section later.
- Player-specific record screens are undecided and need later clarification.
- Player list first pass should focus on management clarity. Player-specific
  record views are deferred.
- Desktop layout should keep a left primary navigation and central work area.
- A right-side panel is optional and should only be used when it helps the
  current workflow.
- Mobile should use a simpler structure: top screen context, central work area,
  and a side menu opened from a top-left hamburger button.
- Mobile should not use bottom-tab navigation.
- Desktop and mobile primary navigation should include `라인업` near the top,
  immediately after `Dashboard`.
- Web and mobile should feel like the same product. Differences should be in
  layout, ordering, and collapsed/expanded behavior, not in color theme or
  overall visual mood.
- Keep the current dark visual theme. Improve the football pitch treatment in
  tactics and lineup screens without creating a separate mobile theme.

## Out Of Scope For Now

- Private-only access mode
- Database schema changes
- Supabase RLS policy changes
- New authentication providers
- New analytics or statistics logic
- Full visual rebrand
- Dedicated substitutes management in lineup screens

## Open Questions

Questions should be handled one at a time using the `grill-me` skill. If a
question can be answered from the current app or codebase, inspect the app or
code before asking the owner.
