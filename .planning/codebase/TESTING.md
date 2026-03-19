# Testing

## Framework & Tooling
- **Core Testing Framework**: Minitest (Ruby standard library base).
- **Execution Script**: `bundle exec ruby -Itest test/site_render_test.rb` (frequently run inside a Docker sandbox mapped dynamically to root).
- **Linting**: Danger and `proselint` (via CI on PRs only to ensure text is clear of common grammatical missteps).

## Testing Structure & Strategy
1. **Automated Site Output Testing**:
   - Tests assert that Jekyll safely parses posts, layouts, and configurations and outputs reliable components into `_site/`.
   - The primary file mapping these verifications is `test/site_render_test.rb`.
   - Tests check for the absence of broken liquid tags and presence of correct structural HTML constraints.
   
2. **Manual UI/Visual Validation**:
   - Because of the visual aspect of the theme (Minima override), testing heavily leverages manual layout validation.
   - Any visual changes prompt a QA checklist check (detailed in `AGENTS.md`):
     - Check Mobile/Desktop header alignments.
     - Toggle Theme logic visibility and contrast.
     - Content bounds checks for `table`/`code` overflow scenarios.
   - `screenshot_review/` holds visual snapshots for catching layout regressions immediately.

## CI Coverage
- `.github/workflows/ci.yml` strictly catches broken builds or failing Ruby unit tests per push. It ensures the master implementation maintains functional structural parity before GitHub Pages deploy (`github-pages.yml`).
