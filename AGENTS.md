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

This repository currently contains product and implementation specifications for the SDR team manager app. Core planning documents live in `specs/`:

- `specs/requirements.md`: product requirements and domain rules.
- `specs/design.md`: intended Next.js, Supabase, database, and UI architecture.
- `specs/tasks.md`: phased implementation checklist.
- `specs/progress.md`: concise work-status handoff notes for future sessions.

Before starting a new implementation phase or resuming after a context reset,
review `specs/progress.md` along with `specs/tasks.md`. After completing a
meaningful work unit, update `specs/progress.md` with what changed, how it was
verified, current state, next steps, and any remaining risk.

Agent and skill metadata lives in `.agents/` and `skills-lock.json`. When application code is scaffolded, follow the planned structure in `specs/design.md`: `src/app/` for Next.js routes, `src/components/` for UI and feature components, `src/actions/` for server actions, `src/lib/` for Supabase utilities, and `src/types/` for shared TypeScript types.

## Build, Test, and Development Commands

No runnable application package is present yet. After the Next.js scaffold is created, use the standard project commands:

- `npm run dev`: start the local Next.js development server.
- `npm run build`: create a production build and catch server/client boundary issues.
- `npm run lint`: run lint checks.
- `npm test`: run the test suite once tests are added.

Before scaffolding, validate changes by reviewing Markdown and keeping `specs/tasks.md` aligned with `specs/design.md`.

## Coding Style & Naming Conventions

Use TypeScript with Next.js App Router conventions. Prefer Server Components for data-loading pages and Client Components only for interactive UI such as filters, forms, charts, and drag-and-drop lineup boards. Use PascalCase for React components (`PlayerForm.tsx`), camelCase for functions and variables, and kebab-case or route parameter folders for routes following Next.js conventions. Keep database table and column names snake_case, matching the Supabase schema in `specs/design.md`.

## Testing Guidelines

Testing framework and coverage rules are not established yet. When implementation begins, add focused tests around server actions, validation rules, and Supabase data transformations. Name tests after the unit or behavior under test, for example `players.test.ts` or `save-lineup.test.ts`. Always run `npm run lint`, `npm test`, and `npm run build` before submitting functional changes once those scripts exist.

## Commit & Pull Request Guidelines

Current history only shows an initial commit, so no detailed convention is established. Use short, imperative commit subjects, for example `Add player CRUD spec` or `Implement season actions`. Pull requests should include a concise summary, linked issue or task reference when available, test/build results, and screenshots for UI changes.

## Security & Configuration Tips

Do not commit secrets. Store Supabase values in `.env.local`, including `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Follow the Auth and RLS plan in `specs/design.md` before production deployment.
