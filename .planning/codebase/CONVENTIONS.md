# Conventions

## Code Style & Patterns

### CSS / Styling
- **No Hardcoding**: UI layout widths, padding bases, and colors MUST be driven by the `_config.yml` > `design` object. Avoid explicitly defining color values into `_scss/` directly.
- **CSS Custom Properties**: Extract variables via `_includes/head.html` into CSS variables to enable the dual light/dark theme toggle system seamlessly.
- **Responsive Handling**: The site utilizes heavy mobile-first considerations for the header format, and spacing. Reference `theme-customization.md` for specific mobile breakpoints testing (<=560px).

### JavaScript
- **Vanilla Only**: No bloated frameworks. 
- **Defensive Binding**: UI behaviors attach to the DOM defensively. 
  - Use specific `data-*` attributes for functional querying (`[data-theme-toggle]`, `[data-header-search]`).
  - Use `js-` class prefixes for behaviors requiring structure querying (e.g., `.js-article-content`).
- **Feature Isolation**: Functions are kept separate (`initToc`, `initCodeCopy`, `initReadingProgress`) and initialized collectively on `DOMContentLoaded`.

### HTML / Accessibility
- Keep semantic elements.
- Accessible ARIA labels required for icon-only interactions (Search, Theme switch). 
- Avoid inline JS directly inside layout elements. Use `_includes/` to keep markup clean.

## Documentation
- Ensure any modifications to the visual structure are updated within `docs/theme-customization.md`.
- Keep `AGENTS.md` up-to-date for automated agents analyzing directory limits or workflow rules.
- Follow "Single Source of Truth" by referencing config variables out of `docs/`.
