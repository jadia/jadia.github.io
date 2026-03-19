# AGENTS.md

This file is the onboarding and operating guide for any AI agent working on `jadia.dev`.

## Project Snapshot

- Site type: Jekyll-based technical blog.
- Current style: Minimal, chronology-first layout with a compact header, search trigger, and theme toggle.
- Source-of-truth branch in workflows: `master`.
- Deploy target: GitHub Pages via artifact upload + deploy actions.

## Stack And Runtime

- Ruby: `>= 3.1.0` (see `.ruby-version` and `Gemfile`).
- Jekyll: `~> 3.10.0`.
- Theme base: `minima ~> 2.5.1` with custom layouts/includes/styles.
- Plugins:
  - `github-pages ~> 232`
  - `jekyll-feed ~> 0.17.0`
  - `jemoji ~> 0.13.0`
  - `jekyll-sitemap ~> 1.4.0`
  - `jekyll-paginate-v2`
  - `jekyll-redirect-from`
  - `jekyll-compose`
- Tests: Minitest (`test/site_render_test.rb`).

## How The Site Is Built

1. `_config.yml` defines metadata, design tokens, collections, defaults, plugins, and pagination.
2. `_includes/head.html` maps config tokens into CSS custom properties.
3. `assets/main.scss` imports Minima plus `_scss/_custom.scss`.
4. `assets/main.js` handles interactive behavior:
   - theme toggle
   - compact expanding header search
   - article TOC
   - code copy button
   - search page filtering
   - reading progress bar
   - lazy Disqus load
5. Jekyll builds static pages into `_site/`.

## Important Directories

- `_layouts/`: layout shells (`default`, `home`, `article`, etc).
- `_includes/`: shared UI fragments (header, footer, share links, icons, head metadata).
- `_posts/`: chronological technical posts (single publishing model).
- `_pages/`: route-driven standalone pages.
- `_scss/`: custom style system.
- `assets/`: JS, SCSS entrypoint, media assets.
- `test/`: regression tests for build/render outputs.
- `docs/`: internal project documentation (excluded from final build).
- `screenshot_review/`: visual QA screenshots from recent review cycles.

## CI/CD

- CI workflow: `.github/workflows/ci.yml`
  - Trigger: push/pull_request on `source`.
  - Runs Jekyll build + regression tests.
  - Runs Danger/proselint on PRs.
- Deploy workflow: `.github/workflows/github-pages.yml`
  - Trigger: push to `source` or manual dispatch.
  - Builds site and uploads artifact.
  - Deploys with `actions/deploy-pages@v4`.

## Configuration-First Theming

Theme tokens are centralized under `design` in `_config.yml`.

- `design.typography`: font stacks and Google Fonts URL.
- `design.layout`: shell width and article content width.
- `design.palette.light` / `design.palette.dark`: semantic color system.
- `design.header.mobile`: mobile header/toggle positioning controls.
- `design.interaction.selection`: selected-text color blending controls.

When possible, add new design controls in config and wire them via CSS variables instead of hardcoding values in SCSS.

## Known UX Constraints

- Mobile header is intentionally compact; nav links are hidden on very small screens.
- Header search is icon-first and expands inline when activated.
- Reading progress appears only on article pages (`.js-article-content`).
- Code copy buttons are injected by JS and should remain stable when code panes scroll.

## QA Checklist For UI Changes

Run this checklist for any layout/theme update:

1. Desktop + mobile (<=560px) header alignment.
2. Theme toggle placement and contrast in both themes.
3. Footer alignment and link visibility in both themes.
4. Article typography hierarchy (`h2`, `h3`, `h4`, body text, code blocks).
5. Search interactions (header search + `/search` page).
6. Reading progress bar visibility and smooth updates.
7. No horizontal page overflow on home/article/footer.

## Local Development Commands

Primary path for this repo is Docker (works even when local Ruby/Bundler are missing):

1. Build tool image:
   - `docker build -t jadia-dev-test .`
2. Serve site locally:
   - `docker run --rm -ti -v $(pwd):/work -w /work -p 4000:4000 jadia-dev-test bundle exec jekyll serve --host=0.0.0.0 --livereload`
3. Build once:
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll build --trace`
4. Run tests:
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec ruby -Itest test/site_render_test.rb`
5. Run any other bundler command:
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec <command>`

Secondary path (only when local Ruby `3.1+` and Bundler are installed):

- Install gems: `bundle install`
- Build once: `bundle exec jekyll build --trace`
- Run dev server: `bundle exec jekyll serve --livereload`
- Run tests: `bundle exec ruby -Itest test/site_render_test.rb`

## Documentation Map

See `docs/README.md` for the documentation index and deep customization references.

## Agent Rules For This Repository

- Do not treat `_site/` as editable source.
- Preserve content slugs/permalinks unless migration is intentional.
- Treat the site as post-only. Legacy `/notes` and `/guides` routes are redirects.
- Keep accessibility labels on icon-only controls.
- Prefer config-driven theme values over literal constants in SCSS.
- If visual regressions appear, check `screenshot_review/` first.
