# Architecture

## System Pattern
The application follows a standard **Static Site Generator (SSG)** pattern utilizing **Jekyll**. There is no traditional backend runtime; instead, Markdown content and configuration files are processed head-of-time (AOT) to generate static HTML, CSS, and JS.

## Data Flow
1. **Content Authoring**: Technical articles are written in Markdown within `_posts/` and standalone pages in `_pages/`.
2. **Configuration driven UI**: Design variables exist in `_config.yml` (under `design:` block).
3. **Template Binding**: During build, `_includes/head.html` extracts `_config.yml` tokens and injects them into the DOM as CSS Custom Properties (`--color-bg`, etc).
4. **Style Compilation**: Jekyll compiles `assets/main.scss` (which imports `minima` and custom partials like `_scss/_custom.scss`), substituting these variables across light/dark themes.
5. **Output**: The built static payload is dumped into `_site/`.

## Key Abstractions
- **Theming System**: 
  Instead of hardcoding color hexes or layout widths in CSS, developers modify the `_config.yml`. The config acts as the central state for structural design. 
- **Vanilla JS Modules**:
  Frontend interactions (like reading progress, search modal, TOC generation, theme toggling) are self-contained in `assets/main.js` via dedicated discrete functions (`initThemeToggle`, `initHeaderSearch`). They latch onto `[data-*]` or `.js-*` DOM hooks preventing conflict with stylistic CSS targets.

## Entry Points
- **Build**: `bundle exec jekyll build` or `serve`.
- **Frontend Execution**: 
  - `index.html` (the parsed outcome of `_layouts/home.html` or `default.html`).
  - `assets/main.js` (DOM content loaded listener triggers specific scripts).
