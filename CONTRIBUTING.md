# Contributing to Neckass Headlines

Thanks for helping improve Neckass Headlines.

This guide covers **how to contribute**. For implementation details, see `DEVELOPMENT.md`.

## Before you start
- Read `SPECIFICATIONS.md` first (source of truth for behavior/accessibility).
- Keep changes scoped and reviewable.
- Prefer edits that preserve no-build, static-host compatibility.

## Contribution workflow
1. Fork + clone the repository.
2. Create a focused branch (`feat/...`, `fix/...`, `docs/...` recommended).
3. Implement your change.
4. Validate locally (manual checks in `DEVELOPMENT.md`, plus optional smoke tests when relevant).
5. Update docs/changelog when behavior or contributor workflow changes.
6. Open a PR with:
   - What changed
   - Why it changed
   - How you validated it
   - Screenshot(s) for visual UI changes

## Quality expectations
- **Spec alignment**: `SPECIFICATIONS.md` wins in case of ambiguity.
- **Accessibility preservation**: retain focus behavior, labels, and live-region messaging.
- **String consistency**: keep copy/share/export language consistent with existing UX.
- **Minimal surprise**: avoid drive-by refactors unrelated to the PR goal.
- **No unnecessary dependencies**: keep the runtime lightweight.

## Pull request checklist
- [ ] Change is aligned with `SPECIFICATIONS.md`.
- [ ] Manual validation completed locally.
- [ ] Optional smoke tests run for changed critical flows (if applicable).
- [ ] Documentation updated where relevant.
- [ ] `CHANGELOG.md` updated for user-visible or process-significant updates.
- [ ] Screenshot(s) included for visible UI changes.

## Commit guidance
- Keep commits focused and atomic.
- Use clear imperative messages (e.g., `docs: modernize contributor and agent guides`).

## Community docs
- Code of Conduct: `CODE_OF_CONDUCT.md`
- Security Policy: `SECURITY.md`
- Development Guide: `DEVELOPMENT.md`

By contributing, you agree your contributions are licensed under the repository `LICENSE`.
