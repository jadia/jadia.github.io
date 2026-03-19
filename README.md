# jadia.dev


`jadia.dev` is a Jekyll-based personal technical writing blog focused on chronological technical posts, hosted securely by GitHub Pages.


## Stack

- Ruby `3.1+`
- Jekyll `3.10`
- GitHub Pages gem set
- Sass for the design system
- Small vanilla JavaScript modules for search, theme toggle, TOC, and code-copy UX
- GitHub Actions for CI and deployment

## Content model

- `posts`: all published content in [`_posts`](./_posts)

Legacy routes such as `/til`, `/howto`, `/notes`, `/guides`, and `/posts` are retained as redirects to `/archive` for compatibility.

## Local development

### Using Docker (Primary Method)

The easiest way to run the site locally is using Docker.

```bash
docker build -t jadia-dev .
docker run --rm -ti -v $(pwd):/work -p 4000:4000 jadia-dev
```

The local site will be available at `http://127.0.0.1:4000`.

#### Run build checks in Docker

```bash
docker build -t jadia-dev-test .
docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll build --trace
docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec ruby -Itest test/site_render_test.rb
```

#### Run any Bundler command in Docker

```bash
docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec <command>
```

### Using local Ruby

#### Requirements

- Ruby `3.1+`
- Bundler

#### Install dependencies

```bash
bundle install
```

#### Run the site

```bash
bundle exec jekyll serve
```

The local site will be available at `http://127.0.0.1:4000`.

### Run the regression suite (local Ruby)

```bash
bundle exec ruby -Itest test/site_render_test.rb
```

## Authoring workflow

The project securely relies on the standard `jekyll-compose` plugin to scaffold new posts cleanly. This natively respects your global `_config.yml` defaults.

### Create a post (using Docker)

If you are using the primary containerized workflow:

```bash
docker run --rm -v $(pwd):/work -w /work jadia-dev-test bundle exec jekyll post "Your Post Title"
```

### Create a post (using local Ruby)

If you have a local Bundler environment prepared:

```bash
bundle exec jekyll post "Your Post Title"
```

This command will automatically generate a new markdown file named tightly with today's date in `_posts/` and inject the dynamic boilerplate frontmatter defined in your config.

## Build and deployment flow

- CI runs on pushes and pull requests to `master`
- CI builds the site and runs generated-site regression tests
- GitHub Pages deployment builds from `master` and publishes the generated `_site` artifact

> **Note:** The CI pipelines use `ruby/setup-ruby` directly on GitHub Actions runners. They do not build or test the local `Dockerfile`, which is why Docker-specific build errors are not caught by the regression suite. The Docker setup is currently provided purely as a convenience for local development.

Workflow definitions live in:

- [`.github/workflows/ci.yml`](./.github/workflows/ci.yml)
- [`.github/workflows/github-pages.yml`](./.github/workflows/github-pages.yml)

## Repository notes

- [`docs/refactor-review.md`](./docs/refactor-review.md) records the refactor findings and direction
- Site configuration lives in [`_config.yml`](./_config.yml)
