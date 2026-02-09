# Contributing to Neckass Headlines

Thanks for your interest in improving Neckass Headlines.

This document defines the contribution workflow and collaboration expectations.
Implementation details (architecture, file map, and testing flow) live in `DEVELOPMENT.md`.

## Contribution workflow
1. Fork and clone the repo.
2. Create a branch for your change.
3. Implement your change following `SPECIFICATIONS.md`.
4. Validate locally (see `DEVELOPMENT.md`).
5. Open a PR with a concise summary and test notes.

## Contribution standards
- **Follow the spec**: `SPECIFICATIONS.md` is the source of truth for UI/UX and accessibility behavior.
- **Keep JavaScript centralized**: Avoid inline scripts; keep behavior in JavaScript modules.
- **String consistency**: Reuse existing copy strings for share/copy messages where possible.
- **Accessibility first**: Preserve focus states, aria labels, and loader announcements.
- **Prefer scoped changes**: Favor small, targeted edits over broad refactors.

## Pull request checklist
- [ ] Changes align with `SPECIFICATIONS.md`.
- [ ] Manual validation completed locally.
- [ ] Updated docs when behavior/structure changed.
- [ ] Included screenshots for visual UI changes.
- [ ] Added a changelog note when the change is user-visible.

## Community and policy docs
- Code of Conduct: `CODE_OF_CONDUCT.md`
- Security reporting: `SECURITY.md`
- Changelog conventions: `CHANGELOG.md`

## License
By contributing, you agree that your contributions are licensed under the project license.
