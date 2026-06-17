# Repository Guidelines

## Collaboration Context

When proposing or making changes, explain the practical product impact first and
keep implementation details secondary. Use plain language for web development,
Git, Next.js, Supabase, deployment, authentication, and testing concepts.

Avoid vague AI/business jargon and do not over-explain general data, statistics,
or analysis concepts unless they are directly relevant. When a technical term is
needed, define it briefly in context.

For decisions that affect product behavior, data structure, security, or ongoing
maintenance, summarize the tradeoff and recommend a default. Do not ask the
owner to choose between low-level implementation options unless the choice
changes user experience, cost, risk, or maintainability in a meaningful way.

When reporting progress, include what changed, why it matters, how to verify it,
and any remaining risk. Keep command output and error messages summarized unless
the exact text is needed for troubleshooting.

## Project Structure & Module Organization

This repository keeps human-readable project knowledge under `docs/`. Core planning documents live in `docs/specs/`:

- `docs/specs/requirements.md`: product requirements and domain rules.
- `docs/specs/design.md`: intended Next.js, Supabase, database, and UI architecture.
- `docs/specs/tasks.md`: phased implementation checklist.
- `docs/specs/progress.md`: concise current status, next actions, and remaining risk.
- `docs/specs/progress-history.md`: detailed historical implementation log.
- `docs/security.md`: security model, RLS checklist, editor access rules, and key handling.
- `docs/handoff.md`: short next-session brief that may be fully replaced at the end of each session.

At the start of a new implementation phase or after a context reset, review:

1. `docs/specs/progress.md`
2. `docs/specs/tasks.md`
3. `docs/specs/design.md` before adding or moving application code
4. `docs/security.md` before touching Supabase tables, RLS, Auth, editor access,
   environment keys, or deployment security

Use `docs/specs/progress-history.md` only when older implementation detail is needed.

After completing a meaningful work unit, keep `docs/specs/progress.md` short and
focused on current state, verification, next steps, and remaining risk. Move
long historical detail to `docs/specs/progress-history.md`.

Use `docs/handoff.md` as an ephemeral continuation note, not a permanent log.
It may be fully replaced before a new session or at the end of a session. Keep
only the current app/database/deployment state, recent work, immediate next
actions, cautions, and key document links.

Agent and skill metadata lives in `.agents/` and `skills-lock.json`. When
application code is scaffolded, follow the planned structure in
`docs/specs/design.md`:

- `src/app/`: Next.js routes.
- `src/components/`: UI and feature components.
- `src/actions/`: server actions.
- `src/lib/`: Supabase utilities.
- `src/types/`: shared TypeScript types.


## Build, Test, and Development Commands

The Next.js application package is present. In PowerShell, prefer `npm.cmd`
because prior sessions hit the Windows `npm.ps1` execution policy when using
plain `npm`.

- `npm.cmd run dev`: start the local Next.js development server.
- `npm.cmd run build`: create a production build and catch server/client boundary issues.
- `npm.cmd run lint`: run lint checks.
- Do not run `npm test` unless a test script is added to `package.json`.

Before submitting functional changes, run:

- `npm.cmd run lint` if available.
- `npm.cmd run build`.
- `npm test` only if it exists in `package.json`.

For documentation-only changes, validate by reviewing Markdown and keeping
`docs/specs/progress.md`, `docs/specs/design.md`, and `docs/AGENTS.md` aligned
with the current repository state.

## Coding Style & Naming Conventions

Use TypeScript with Next.js App Router conventions. Prefer Server Components for
data-loading pages and Client Components only for interactive UI such as filters,
forms, charts, and drag-and-drop lineup boards.

Use PascalCase for React components, for example `PlayerForm.tsx`. Use camelCase
for functions and variables. Use kebab-case or route parameter folders for routes
following Next.js conventions. Keep database table and column names snake_case,
matching the Supabase schema in `docs/specs/design.md`.


## Testing Guidelines

Testing framework and coverage rules are not established yet. When implementation
begins, add focused tests around server actions, validation rules, and Supabase
data transformations. Name tests after the unit or behavior under test, for
example `players.test.ts` or `save-lineup.test.ts`.

Do not treat the absence of a test script as a failure. If `npm test` is not
defined, report that tests are not configured and rely on lint/build verification.

## Review Patterns

Avoid these recurring issues:

- Do not introduce Client Components unless interactivity is required.
- Do not make broad refactors when a small, focused change is enough.
- Do not move domain rules out of `docs/specs/requirements.md` without updating related docs.
- Do not let `docs/specs/progress.md` become a long historical log.
- Do not use `docs/handoff.md` as a permanent record.
- Do not change Supabase schema, RLS, Auth, editor access, environment variables,
  or deployment security without checking `docs/security.md`.
- After code changes, report verification commands and remaining risks.

## Commit & Pull Request Guidelines

Current history only shows an initial commit, so no detailed convention is
established. Use short, imperative commit subjects, for example `Add player CRUD spec`
or `Implement season actions`.

Pull requests should include a concise summary, linked issue or task reference
when available, test/build results, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit secrets. Store Supabase values in `.env.local`, including `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Follow `docs/security.md` for Auth, RLS, editor access, key handling, and security verification checks before production deployment.
