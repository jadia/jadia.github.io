# Concerns

## Technical Debt & Fragile Areas
- **Three-Tiered Theme System**: The primary architecture requires mapping tokens across `_config.yml`, `_includes/head.html`, and `_scss/_custom.scss`. Forgetting to hook up a configuration into `head.html` renders the token entirely dormant. This indirection creates slight friction and risk of orphaned configuration keys.
- **Mobile Header Overlap**: The mobile header (<=560px) design relies on meticulously padded values (`right_clearance`, `actions_right`). Careless tweaking or padding modifications easily cascade into overlapping the logo, search icon, and theme toggle buttons.
- **JavaScript Code Wrap Mutation**: `initCodeCopy()` mutates the DOM explicitly, wrapping `pre` blocks with `.code-block` arrays post-render. If this isn't relatively positioned correctly, horizontal scrolls within long codeblocks will cause the "Copy" floating button to drift awkwardly.

## System Dependencies
- **Disqus Lifecycle**: Relying on Disqus for comment persistence. The lazy loading system mitigates performance overhead but relies entirely on external frame manipulation logic.
- **Local Dev Drift**: Due to Ruby ecosystem variance (Bundler, native extensions), the guide recommends spinning up a localized Docker wrapper for Jekyll development. While resilient, it obfuscates standard workflow executions.

## Maintenance & Refactoring
- Legacy pages (`/notes`, `/guides`) are permanently bound to redirect handlers. Refactoring routing patterns requires delicate navigation over these explicit `jekyll-redirect-from` plugins to prevent link breakages across the internet.

## Security
- The static nature of the site mitigates dynamic injection vulnerabilities.
- User input is isolated through Disqus, which uses a sandboxed iframe.
- No explicit CSP (Content Security Policy) implemented in the generated meta headers.

## Performance
- The site generates static assets, leading to fast Time to First Byte (TTFB).
- However, JavaScript (`assets/main.js`) isn't currently run through a minification pipeline.
- CSS is appropriately compressed via `sass: style: :compressed` in `_config.yml`.
