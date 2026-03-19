# Stack

## Overview
This repository (`jadia.dev`) is a static site generated via Jekyll. It primarily uses Ruby for building the site and HTML/SCSS/JS for the frontend, strictly avoiding heavy frontend frameworks.

## Languages
- **Ruby**: `>= 3.1.0`
- **JavaScript**: Vanilla JS for frontend interactivity
- **SCSS/CSS**: Styling, leveraging CSS Custom Properties for theming
- **HTML/Markdown**: Content and layouts

## Runtimes & Frameworks
- **Jekyll**: `~> 3.10.0`
- **Theme**: `minima ~> 2.5.1` (Heavily extended via custom includes/scss)

## Primary Dependencies
Specified in `Gemfile`:
- `github-pages`
- `jekyll-feed`
- `jemoji`
- `jekyll-sitemap`
- `jekyll-paginate-v2`
- `jekyll-redirect-from`
- `jekyll-compose`
- `danger` & `danger-prose` (for PR linting)

## Configuration
- `_config.yml`: The central source of truth for site settings and UI theme tokens.
- `Gemfile`: Ruby dependency manifestations.
- `Dockerfile`: Exists to wrap the Ruby/Bundler environment for local development without polluting the host OS.

## Tooling
- **Test Runner**: Minitest (`test/site_render_test.rb`)
- **CI**: GitHub Actions
