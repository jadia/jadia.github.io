# Structure

## Directory Layout
Standard Jekyll taxonomy extended with custom specific locations for docs and tests:

- `_config.yml`: Core settings, metadata, and design tokens (The single source of truth for the theme).
- `_layouts/`: Base HTML templates mapping to page types (`default`, `home`, `article`).
- `_includes/`: Reusable HTML fragments. Contains critical components like the header, footer, and `head.html` (which bootstraps the design system CSS variables).
- `_posts/`: Chronological technical markdown posts.
- `_pages/`: Standalone route-driven markdown pages (e.g., about, archive, tags).
- `_scss/`: Contains `_custom.scss` which overrides the underlying Minima theme styles using CSS variables.
- `assets/`: 
  - `main.js`: Aggregate file for all interactive frontend vanilla JS.
  - `main.scss`: The main stylesheet entrypoint.
  - Image assets and other static resources.
- `test/`: Home to Minitest unit tests confirming functional behavior and layout regression (`site_render_test.rb`).
- `docs/`: Internal project rules and customization guidelines (e.g., `theme-customization.md`, `AGENTS.md`). Excluded from actual build.
- `screenshot_review/`: Visual QA comparisons for design regression.
- `.github/workflows/`: CI/CD actions for build, test, and GH Pages deployment.

## Convention Defaults
- Build targets map directly to `_site/` which is gitignored and shouldn't be touched directly.
- Legacy URLs are maintained via `jekyll-redirect-from` plugins, usually embedded as frontmatter inside pages/posts.
