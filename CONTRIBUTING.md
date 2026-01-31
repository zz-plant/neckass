# Contributing to Neckass Headlines

Thanks for your interest in improving Neckass Headlines! This project is a static site, so contributions are lightweight and easy to test locally.

## Getting started
1. Fork and clone the repo.
2. Create a branch for your change.
3. Open `index.html` in a modern browser to view changes. No build step required.

## Project structure
- `index.html`: Page markup and layout structure.
- `styles.css`: Theme, layout, and component styling.
- `script.js`: Headline navigation, sharing, export, and persistence.
- `llm.js`: Tiny LLM mock used by `script.js`.
- `icons/`: Social share icons.

## Development guidelines
- **Follow the spec**: Use `SPECIFICATIONS.md` as the source of truth for UI/UX and accessibility behavior.
- **Keep JavaScript centralized**: Avoid inline scripts; put behavior in `script.js`.
- **String consistency**: Reuse existing copy strings for share/copy messages where possible.
- **Accessibility**: Preserve focus states, aria labels, and loader announcements.
- **Minimal changes**: Prefer small, targeted edits over large refactors.

## Testing
- Manual check: Open `index.html` directly and validate layout and interactions.
- If you update UI visuals, capture a screenshot to show the change.

## Submitting changes
- Ensure your update matches `SPECIFICATIONS.md` requirements.
- Include a short summary of the change and any manual test steps.
- If you changed UI visuals, include a screenshot in your PR description.

## License
By contributing, you agree that your contributions will be licensed under the project’s license.
