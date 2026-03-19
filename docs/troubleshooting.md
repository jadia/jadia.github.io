# Troubleshooting

## `/.well-known/appspecific/com.chrome.devtools.json` Not Found

Symptom:

- Jekyll dev server logs a not found error while Chrome DevTools probes that path.

Status:

- Handled by keeping `.well-known/appspecific/com.chrome.devtools.json` in source and including `.well-known` in `_config.yml`.

## Header Controls Overlap Logo On Mobile

Checklist:

1. Review `design.header.mobile.*` values in `_config.yml`.
2. Verify `.site-header .shell` mobile padding in `_scss/_custom.scss`.
3. Confirm nav links are hidden at small breakpoints.
4. Retest at widths 390px and 430px.

## Theme Toggle Misaligned Right

Primary controls:

- `design.header.mobile.actions_right`
- `design.header.mobile.shell_padding_right`

If still inset, reduce right shell padding and keep `actions_right: "0rem"`.

## Copy Button Moves With Code Scroll

Expected behavior:

- `.code-copy` should remain fixed at top-right of `.code-block`.

Checks:

1. Ensure `pre` remains scrollable (`overflow: auto`).
2. Ensure `.code-copy` is `position: absolute`.
3. Ensure wrapper `.code-block` is `position: relative`.

## Missing Styles After Config Changes

If a new design token appears ineffective:

1. Confirm token exists in `_config.yml`.
2. Confirm mapped CSS variable exists in `_includes/head.html`.
3. Confirm selector in `_scss/_custom.scss` uses that variable.
4. Rebuild site and inspect compiled CSS.

## Search Control Problems

Header search behavior relies on:

- `[data-header-search]`
- `[data-header-search-toggle]`
- `[data-header-search-input]`

If interaction breaks, verify these attributes in `_includes/header.html` before editing JS.

## Test Failures After Markup Refactors

Most tests assert class-level selectors. If classes change:

1. Update tests in `test/site_render_test.rb`.
2. Ensure selectors still express behavior, not cosmetic naming only.
