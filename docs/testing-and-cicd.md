# Testing And CI/CD

## Local Verification

Primary method (Docker) for machines without local Ruby/Bundler:

1. Build image:
   - `docker build -t jadia-dev-test .`
2. Build site:
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll build --trace`
3. Run regression tests:
   - `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec ruby -Itest test/site_render_test.rb`

Secondary method (local Ruby `3.1+`):

1. `bundle install` (if dependencies changed).
2. `bundle exec jekyll build --trace`
3. `bundle exec ruby -Itest test/site_render_test.rb`

## Running Bundler Commands Through Docker

Use this pattern for any command that normally starts with `bundle exec`:

`docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec <command>`

Examples:

- `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll doctor`
- `docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll clean`

## Regression Tests

Primary test file: `test/site_render_test.rb`.

Current coverage includes:

- home page brand/search/feed rendering.
- search page and search index generation.
- markdown heading hierarchy and TOC container presence.
- compiled CSS contains key selectors.
- legacy collection routes redirect to `/archive`.

Add tests when:

- new layout behavior is introduced.
- classes/selectors used by JS are renamed.
- config-driven rendering logic changes.

## CI Workflow

File: `.github/workflows/ci.yml`

- Triggers:
  - push to `master`
  - pull_request to `master`
- Steps:
  - checkout
  - Ruby setup (3.1, bundler cache)
  - Jekyll production build (including WebP conversion)
  - render regression tests
  - optional PR prose lint via Danger

## Link Checker Workflow

File: `.github/workflows/link-checker.yml` (and potentially other configurations like `.lycheerc`).

- Triggers:
  - weekly
  - manual dispatch
  - pull_request (posts comments rather than failing build)
- Uses `lycheeverse/lychee-action` to ensure all external and internal links on the site are alive.

## Deploy Workflow

File: `.github/workflows/github-pages.yml`

- Trigger: push to `master` or manual dispatch.
- Build job:
  - checkout + Ruby setup
  - `jekyll build` to `./_site`
  - upload pages artifact
- Deploy job:
  - deploy artifact with `actions/deploy-pages@v4`

## Common Pipeline Failure Causes

- Ruby version mismatch (`< 3.1`).
- Plugin dependency drift after Gem updates.
- Broken Liquid include references.
- CSS/JS selector drift breaking test expectations.

## Recommended CI Enhancements (Future)

- Add Lighthouse CI against a built preview artifact.
- Add HTMLProofer-style link validation for internal links.
- Add visual snapshot tests for header/footer alignment at mobile breakpoints.
