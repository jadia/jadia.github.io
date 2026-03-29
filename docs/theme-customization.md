# Theme Customization Guide

This is the primary guide for changing visual design without destabilizing the site.

## Customization Strategy

Use this order for any theme work:

1. Update tokens in `_config.yml` under `design`.
2. Map any new tokens in `_includes/head.html` as CSS variables.
3. Consume variables in `_scss/_custom.scss`.
4. Only then consider layout/template changes.

This keeps the system configurable and avoids hardcoded one-off styles.

## Token Map Overview

- Location of tokens: `_config.yml > design`.
- Mapping layer: `_includes/head.html` (`:root` and `[data-theme="dark"]`).
- Style consumers: `_scss/_custom.scss`.

If you add a key in config but do not map it in head, it has no effect.

## Typography Customization

### Change Fonts

1. Update `design.typography.google_fonts_url`.
2. Set `display`, `ui`, `body`, `code` stacks.
3. Verify:
   - headings remain visually distinct,
   - body text remains readable at `1.1rem+`,
   - code alignment remains monospaced.

### Readability Targets

- Paragraph body size: `1.08rem - 1.2rem`.
- Line-height: `1.7 - 1.9`.
- Content width:
  - Dense technical reading: `72ch - 86ch`.
  - More spacious: up to `92ch` with stronger line-height discipline.

## Color System Customization

### Palette Principles

- Keep `accent` high contrast against both `bg` and `surface`.
- Keep `text` and `heading` clearly readable in both themes.
- Keep `text_soft` at least AA-readable for metadata.
- Use `highlight` for selected text and callout accents.

### Recommended Workflow

1. Set light palette first.
2. Build dark palette as semantic equivalent, not inverted raw colors.
3. Validate:
   - links on body text,
   - code block contrast,
   - footer contrast,
   - icon button visibility.

### Selection Color

Selection is controlled by:

- `design.interaction.selection.text`
- `design.interaction.selection.accent_mix`
- `design.interaction.selection.highlight_mix`

This drives `::selection` and `::-moz-selection` blend behavior.

## Header And Mobile Controls

### Header Action Cluster

The compact search + theme toggle position is controlled via:

- `design.header.mobile.right_clearance`
- `design.header.mobile.actions_right`
- `design.header.mobile.actions_top`
- `design.header.mobile.shell_padding_left`
- `design.header.mobile.shell_padding_right`

Use these first before editing raw SCSS positions.

### Mobile Alignment Process

1. Start a local server.
2. Test at widths: `390`, `430`, and `560`.
3. Check logo, search icon, and theme toggle overlap.
4. Ensure no horizontal overflow appears.

## Layout And Spacing

Primary layout controls:

- `design.layout.shell_width`: overall site container.
- `design.layout.content_width`: reading column width.

When changing content width, recheck:

- table/code overflow behavior,
- image scaling,
- TOC/sidebar breakpoints.

## Component-Specific Tuning

### Footer

Key selectors in `_scss/_custom.scss`:

- `.site-footer`
- `.footer-shell`
- `.footer-top`
- `.footer-links`
- `.footer-meta`
- `.footer-bottom`

Adjust structure in `_includes/footer.html` only if CSS tuning is insufficient.

### Share Links

Structure:

- `_includes/share-links.html`

Styles:

- `.share-links`
- `.share-link`

### Code Blocks And Copy Button

Structure is injected by JS:

- `initCodeCopy()` wraps each `pre` in `.code-block` and inserts `.code-copy`.

Styles:

- `.code-block`
- `.article-content pre, .page-body pre`
- `.code-copy`

If button drifts during horizontal scroll, verify button is absolutely positioned against `.code-block`, not within scrollable content.

## Configuration-First Examples

### Example A: Move Mobile Toggle Further Right

Edit `_config.yml`:

```yaml
design:
  header:
    mobile:
      actions_right: "0rem"
```

### Example B: Widen Article Reading Column

Edit `_config.yml`:

```yaml
design:
  layout:
    content_width: "86ch"
```

### Example C: Make Selection More Teal

Edit `_config.yml`:

```yaml
design:
  interaction:
    selection:
      accent_mix: "12%"
      highlight_mix: "88%"
```

## Media And Social Images

### WebP Optimization
All PNG/JPG images included in content or assets are automatically compressed via `_plugins/image_optimizer.rb` into WebP. 
- PNGs are explicitly optimized losslessly (safeguarding the quality of screenshots and diagrams). 
- JPG/JPEGs are gracefully optimized lossily to save bandwidth.

### OpenGraph (OG) Previews
The static hero image used for social embedding is located at:
`assets/images/orion-nebula.jpg`

> **Important**: This specific graphic is explicitly excluded from WebP conversion within the `image_optimizer.rb` logic so it remains a native JPEG. Social media crawler bot compatibility favors JPEGs and PNGs exclusively. Refrain from pointing default social data to heavily compressed `.webp` endpoints.

## Safe Change Checklist

1. `bundle exec jekyll build --trace`
2. `bundle exec ruby -Itest test/site_render_test.rb`
3. Manual checks:
   - home page desktop/mobile
   - one long article desktop/mobile
   - footer alignment both themes
   - search icon expansion and submission
5. Validate screenshot review issues are closed.

### Technical Callouts

Styles are located in `_scss/_custom.scss` under `/* Technical Callouts */`. 

- `.callout`: Base styles (padding, margin, shadow).
- `.callout--tip`: Uses `var(--accent)`.
- `.callout--note`: Uses `var(--highlight)`.
- `.callout--warning`: Uses a custom amber `#f59e0b`.

If you change your site's main accent or highlight color in `_config.yml`, the callouts will automatically update to stay in sync.
