# Jadia.dev Refactor Review

## Scope

Stabilize the existing Jekyll site first, then create a safe base for a later visual/theme refactor.

## Current Findings

### Runtime and dependencies

- Root site is pinned to older Jekyll/GitHub Pages packages:
  - `jekyll ~> 3.8.5`
  - `github-pages ~> 205`
  - `jemoji ~> 0.11.1`
  - `jekyll-feed ~> 0.9`
- Upstream reference is newer and still compatible with GitHub Pages:
  - `jekyll ~> 3.10.0`
  - `github-pages ~> 232`
  - `jemoji ~> 0.13.0`
  - `jekyll-feed ~> 0.17.0`
- Root Gemfile mixes `jekyll-paginate-v2` with `_config.yml` plugin entry `jekyll-paginate`. That mismatch is a maintenance risk and can produce confusing pagination behavior.
- Root repo has no Node pipeline, while upstream now uses `jekyll-postcss` + Tailwind/PostCSS.
- Local machine currently has Ruby `2.7.0`, Node `22.18.0`, npm `11.11.1`, and no `bundle` executable installed.
- Updated dependency resolution now requires Ruby `3.1+` in practice because the newer GitHub Pages stack resolves to newer Nokogiri builds.

### CI/CD

- Root CI uses deprecated or stale components:
  - `actions/checkout@v2`
  - `actions/cache@v1`
  - hard-pinned `ruby 2.6.6`
  - deprecated `helaili/jekyll-action@2.5.0`
- Root deploy workflow still assumes a branch-push model instead of the current GitHub Pages artifact deployment flow.
- Upstream already migrated to a modern Pages flow using:
  - `actions/checkout@v4`
  - `ruby/setup-ruby@v1`
  - `actions/upload-pages-artifact@v3`
  - `actions/deploy-pages@v4`

### Site structure

- Site is still fundamentally a Minima fork with many custom overrides in `_scss/custom.scss`.
- `_site` is checked in and should not be treated as source of truth.
- README still describes Travis-based behavior that no longer matches the repo.

### Rendering issue hypothesis

- The reported `##` heading issue appears more likely to be a styling problem than a markdown parser problem.
- Upstream explicitly styles post content headings (`.post-content h2`, `.post-content h3`, `.post-content h4`) via Tailwind/PostCSS utilities.
- Root site does not define comparable post-content heading styles, so secondary headings can inherit weak/default Minima sizing and spacing.

## Changes Applied

1. Upgraded the Ruby/Jekyll baseline to the newer GitHub Pages-compatible stack used by the upstream reference.
2. Declared Ruby `3.1+` for the repo and refreshed `Gemfile.lock`.
3. Replaced the deprecated deployment workflow with the modern GitHub Pages artifact deployment flow.
4. Modernized CI to use current GitHub Actions versions and added generated-site regression tests.
5. Added explicit `.post-content` and `.page-content` heading styles so `##` and `###` render with clear visual hierarchy.
6. Fixed one malformed markdown post where an open code fence trapped a heading inside a code block.
7. Added this review document and excluded internal/reference directories from Jekyll processing.

## Next Phase

1. Decide whether the next phase should stay on the current Minima-derived structure or move to a distinct new theme.
2. Decide whether to adopt a Node/PostCSS pipeline for future design work or keep CSS-only overrides.
3. Remove or regenerate the checked-in `_site` output once deployment expectations are confirmed.

## Open Questions

- Do we want to stay on GitHub Pages-compatible Jekyll 3.10 for now, or intentionally decouple from GitHub Pages constraints later and move to Jekyll 4+?
- Should the root site keep the current Minima-derived structure for this stabilization phase, with visual redesign deferred to a follow-up branch?
