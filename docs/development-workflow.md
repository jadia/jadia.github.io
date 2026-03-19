# Development Workflow

## Daily Loop

1. Pull latest `source`.
2. Build/update local tool image: `docker build -t jadia-dev-test .`
3. Start server with Docker:
   - `docker run --rm -ti -v $(pwd):/work -w /work -p 4000:4000 jadia-dev-test bundle exec jekyll serve --host=0.0.0.0 --livereload`
4. Implement config/template/style changes.
5. Run build + tests in Docker:
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll build --trace`
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec ruby -Itest test/site_render_test.rb`
6. Validate desktop and mobile layouts.

## Local Ruby Fallback

If Ruby `3.1+` and Bundler are already installed locally, direct commands are still supported:

- `bundle install`
- `bundle exec jekyll serve --livereload`
- `bundle exec jekyll build --trace`
- `bundle exec ruby -Itest test/site_render_test.rb`

## Branching Notes

- Keep feature branches focused by concern:
  - content updates
  - visual/theme updates
  - infra/workflow updates
- Avoid mixing dependency upgrades with large design rewrites in one PR.

## Editing Priorities

When a design change is requested:

1. `_config.yml` (tokens).
2. `_includes/head.html` (variable mapping).
3. `_scss/_custom.scss` (presentation behavior).
4. `_includes`/`_layouts` (markup only if needed).
5. `assets/main.js` (interaction only if needed).

## Visual QA Baseline

- Home page at desktop and mobile.
- One long article with code blocks.
- Footer in both light and dark mode.
- Search icon expansion behavior.
- Theme toggle placement.

Use `screenshot_review/` artifacts as regression references.
