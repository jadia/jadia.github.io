# Integrations

## Overview
The website integrates with a few carefully selected third-party services for analytics, comments, and deployment.

## External APIs & Services
- **Google Analytics**:
  - Defined in `_config.yml` as `google_analytics: UA-61932410-4`.
  - Used for basic site traffic tracking.
- **Disqus**:
  - Used for article comments.
  - Defined in `_config.yml` under `disqus.shortname: jadia-dev`.
  - Lazy-loaded via JavaScript in `assets/main.js` (`initDisqusLoader`) to prevent performance penalties on page load.
- **Social Media / SEO Cards**:
  - Twitter Card configurations (`twitter: nitishjadia`).
  - OpenGraph / social sharing metadata (Facebook, LinkedIn).

## Infrastructure & DevOps
- **GitHub Pages**:
  - Site is deployed continuously via GitHub Actions (`.github/workflows/github-pages.yml`).
  - Utilizes `actions/deploy-pages@v4` pushing the Jekyll artifact.
- **GitHub Actions (CI)**:
  - Standard CI pipeline (`.github/workflows/ci.yml`) runs Jekyll builds and Minitest regressions.
  - Implements PR text quality checks using Danger and `proselint`.
- **Docker**:
  - Docker container mapping for local environment wrapping (`docker run ... bundle exec jekyll serve`).
