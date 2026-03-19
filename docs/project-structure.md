# Project Structure

## Root

- `_config.yml`: global metadata + design tokens + plugin settings.
- `Gemfile` / `Gemfile.lock`: Ruby dependencies.
- `index.html`: home route entry.
- `search.json`: generated search index endpoint.
- `AGENTS.md`: onboarding guide for future AI/code agents.

## Content

- `_posts/`: dated technical posts.
- `_pages/`: static pages (`about`, `tags`, `archive`, etc).
- `_til/`, `_howto`: non-output/internal collections currently disabled by default.

## Presentation

- `_layouts/`: page composition layouts.
- `_includes/`: reusable template parts.
- `_scss/`: custom styles.
- `assets/`: JS, SCSS entrypoint, favicons, images.

## Automation

- `.github/workflows/ci.yml`: build + test + PR text linting.
- `.github/workflows/github-pages.yml`: production deploy to Pages.
- `test/`: Minitest-based render regression tests.

## Internal/Reference

- `docs/`: internal documentation (excluded from generated site).
- `screenshot_review/`: visual bug evidence and review snapshots.

## Generated/Non-Source

- `_site/`: generated output directory; do not edit directly.
