# Config Reference (`_config.yml`)

This reference explains the practical impact of each major config section.

## Core Site Metadata

- `title`: primary site title used in header and metadata.
- `description`: SEO/meta summary.
- `baseurl`: empty string for root-domain deployment.
- `url`: canonical site URL.
- `permalink`: post URL format.

## Branding

- `logo`: path to logo image used in header brand mark.
- `branding.tagline`: short site identity string.
- `branding.nav_tagline`: secondary line shown next to logo on larger screens.
- `branding.home_title`: hero/home heading text.
- `branding.home_intro`: home intro paragraph.
- `branding.search_prompt`: placeholder text for search inputs.

## Design System (`design`)

### Typography

- `google_fonts_url`: single source for all loaded web fonts.
- `display`: heading font-family stack.
- `ui`: UI controls and navigation font-family stack.
- `body`: article/body reading font-family stack.
- `code`: monospace stack.

### Layout

- `shell_width`: maximum shell width for overall site container.
- `content_width`: width of article/page readable content.

### Header (Mobile)

- `design.header.mobile.right_clearance`:
  - Reserve room for right-side controls inside `.shell-header`.
- `design.header.mobile.actions_right`:
  - Horizontal offset of search + theme toggle cluster from right edge.
- `design.header.mobile.actions_top`:
  - Vertical offset of the actions cluster.
- `design.header.mobile.shell_padding_left`:
  - Left padding for the header shell on very small screens.
- `design.header.mobile.shell_padding_right`:
  - Right padding for the header shell on very small screens.

### Interaction

- `design.interaction.selection.text`:
  - Text color when user selects content.
- `design.interaction.selection.accent_mix`:
  - Percentage of accent color in selection background blend.
- `design.interaction.selection.highlight_mix`:
  - Percentage of highlight color in selection background blend.

### Palette

`design.palette.light` and `design.palette.dark` both define semantic tokens:

- `bg`, `surface`, `surface_soft`, `surface_strong`
- `border`
- `text`, `text_soft`, `heading`
- `accent`, `accent_strong`, `accent_soft`, `accent_glow`
- `code_bg`, `code_border`
- `track` (reading progress bar)
- `highlight` (selection/blockquote accents)

Use semantic meaning rather than hardcoded roles. Example: use `accent` for interactive highlights, not for body text.

## Navigation

- `navigation.primary`: top navigation links. Hidden on small mobile screens in current CSS.

## Defaults And Collections

- `defaults`: automatic front matter for all content and posts.
- Published model is post-only (`_posts`).
- Legacy routes (`/notes`, `/guides`, `/til`, `/howto`, `/posts`) are redirects maintained in `_pages`.

## Plugins And Build

- `markdown: kramdown`
- `theme: minima`
- `plugins`: feed, emojis, sitemap, pagination, redirects.
- `sass.sass_dir` and `sass.style`: SCSS compile location and compression mode.

## Include / Exclude

- `include` contains `_pages` and `.well-known` paths required at build output.
- `exclude` removes internal docs/tests/reference folders from generated output.

## Footer And Social

- `footer-links`: legacy handles used by footer includes.
- `social`: share metadata definitions.
- `author` + `twitter`: identity metadata for SEO/social cards.

## Pagination

- `pagination.enabled`: true for posts listing pagination.
- `per_page`: number of posts per page.
- `permalink`: path format for paginated pages.

## Third-Party

- `google_analytics`: analytics id.
- `disqus.shortname`: comment provider identifier.

## Compose Defaults

- `jekyll_compose.default_front_matter`: default fields for drafts/posts when using `jekyll-compose`.
