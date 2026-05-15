# Repository Guidelines

## Collaboration Context

The primary project owner is a non-developer with a background in statistics,
professional experience in data analysis, and personal interest in data science.
When proposing or making changes, explain the practical product impact first and
keep implementation details secondary. Avoid assuming familiarity with web
development, Git, Next.js, Supabase, deployment, authentication, or testing
terminology.

Prefer clear, concrete explanations in plain language. When technical terms are
needed, define them briefly in context and connect them to familiar data
concepts where useful, such as tables, records, validation rules, dashboards,
metrics, and data quality checks.

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

Before starting a new implementation phase or resuming after a context reset,
review `docs/specs/progress.md` along with `docs/specs/tasks.md`. Use
`docs/specs/progress-history.md` only when older implementation detail is needed.
Before changing Supabase tables, RLS, Auth, editor access, environment keys, or
deployment security, review `docs/security.md`.
After completing a meaningful work unit, keep `docs/specs/progress.md` short and
focused on current state, verification, next steps, and any remaining risk. Move
long historical detail to `docs/specs/progress-history.md`.

Use `docs/handoff.md` as an ephemeral continuation note, not a permanent log.
It is acceptable and preferred to replace the whole file before a new session or
at the end of a session, keeping only the current app/database/deployment state,
the work just completed, immediate next actions, cautions, and key document
links. Do not use `handoff.md` to preserve historical detail; use
`docs/specs/progress-history.md` for that.

Agent and skill metadata lives in `.agents/` and `skills-lock.json`. When application code is scaffolded, follow the planned structure in `docs/specs/design.md`: `src/app/` for Next.js routes, `src/components/` for UI and feature components, `src/actions/` for server actions, `src/lib/` for Supabase utilities, and `src/types/` for shared TypeScript types.

## Build, Test, and Development Commands

The Next.js application package is present. In PowerShell, prefer `npm.cmd`
because prior sessions hit the Windows `npm.ps1` execution policy when using
plain `npm`.

- `npm.cmd run dev`: start the local Next.js development server.
- `npm.cmd run build`: create a production build and catch server/client boundary issues.
- `npm.cmd run lint`: run lint checks.
- `npm test`: not currently defined in `package.json`.

For documentation-only changes, validate by reviewing Markdown and keeping
`docs/specs/progress.md`, `docs/specs/design.md`, and `docs/AGENTS.md` aligned
with the current repository state.

## Coding Style & Naming Conventions

Use TypeScript with Next.js App Router conventions. Prefer Server Components for data-loading pages and Client Components only for interactive UI such as filters, forms, charts, and drag-and-drop lineup boards. Use PascalCase for React components (`PlayerForm.tsx`), camelCase for functions and variables, and kebab-case or route parameter folders for routes following Next.js conventions. Keep database table and column names snake_case, matching the Supabase schema in `docs/specs/design.md`.

## Testing Guidelines

Testing framework and coverage rules are not established yet. When implementation begins, add focused tests around server actions, validation rules, and Supabase data transformations. Name tests after the unit or behavior under test, for example `players.test.ts` or `save-lineup.test.ts`. Always run `npm run lint`, `npm test`, and `npm run build` before submitting functional changes once those scripts exist.

## Commit & Pull Request Guidelines

Current history only shows an initial commit, so no detailed convention is established. Use short, imperative commit subjects, for example `Add player CRUD spec` or `Implement season actions`. Pull requests should include a concise summary, linked issue or task reference when available, test/build results, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit secrets. Store Supabase values in `.env.local`, including `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Follow `docs/security.md` for Auth, RLS, editor access, key handling, and security smoke tests before production deployment.
