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
- The owner is non-developer and wants UI improvement to proceed by questions
  and sketches before implementation.

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

## What Changed Recently

- Docs were shortened so current requirements are easier to follow.
- Duplicate `docs/specs/guest-player-support.md` was removed.
- Birth date, contact, player memo, guest memo, and player-stat memo were
  removed from app usage.
- Write Server Actions now require approved editor status.
- Score, completion, MOM, and player-stat writes now require match-result
  authority.
- Owner has `can_manage_match_results = true`.
- `npm.cmd run lint` passed.
- `npm.cmd run build` passed.
- `git diff --check` passed with only line-ending warnings.
- The user prefers "basic verification" or plain "확인" for manual checks.

## Immediate Next Actions

1. Commit current changes.
   Recommended commit message:
   `Harden editor permissions and remove sensitive fields`
2. Start UI improvement planning in the next session.
3. For UI work, do not jump straight into implementation. Ask targeted product
   questions and let the owner sketch or describe the intended UI.
4. Keep these UI topics in backlog:
   - mobile login/logout/account-state display,
   - clearer owner/editor permission cues,
   - mobile lineup drag usability,
   - wording cleanup where labels are awkward or mixed-language.
5. When normal editor accounts are added later, verify:
   - normal editor can manage general records and lineups,
   - normal editor cannot write score, MOM, completion, or player stats,
   - owner/result manager can write score, MOM, completion, and player stats.

## Cautions

- Do not commit secrets or service role keys.
- Keep Supabase service role keys out of browser code and Vercel public env vars.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are browser
  public values; RLS must protect the database.
- Some Korean text in `docs/specs/tasks.md` has appeared as mojibake in
  terminal output. Avoid broad automated edits unless encoding is handled
  carefully.
