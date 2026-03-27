function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("jadia-theme", theme);
  } catch (error) {
    // Ignore storage errors in restricted environments.
  }
}

function updateThemeToggle(button) {
  const current = document.documentElement.getAttribute("data-theme") || "light";
  const next = current === "light" ? "dark" : "light";
  const label = next === "dark" ? "Switch to dark theme" : "Switch to light theme";

  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("aria-pressed", String(current === "dark"));
}

function initThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;

  updateThemeToggle(button);
  button.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(current === "light" ? "dark" : "light");
    updateThemeToggle(button);
  });
}

function initHeaderSearch() {
  const root = document.querySelector("[data-header-search]");
  const toggle = root && root.querySelector("[data-header-search-toggle]");
  const input = root && root.querySelector("[data-header-search-input]");
  const form = root && root.querySelector(".header-search-form");
  if (!root || !toggle || !input || !form) return;

  toggle.setAttribute("aria-expanded", "false");

  function openSearch() {
    root.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    window.setTimeout(() => input.focus(), 20);
  }

  function closeSearch() {
    root.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  toggle.addEventListener("click", (event) => {
    if (!root.classList.contains("is-open")) {
      event.preventDefault();
      openSearch();
    } else if (!input.value.trim()) {
      event.preventDefault();
      closeSearch();
    }
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target) && !input.value.trim()) {
      closeSearch();
    }
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSearch();
      toggle.focus();
    }
  });

  form.addEventListener("submit", () => {
    if (!input.value.trim()) closeSearch();
  });
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function initToc() {
  const tocRoot = document.querySelector(".js-article-toc");
  const contentRoot = document.querySelector(".js-article-content");
  if (!tocRoot || !contentRoot) return;

  const headings = Array.from(contentRoot.querySelectorAll("h2, h3"));
  if (headings.length < 2) {
    tocRoot.innerHTML = "<p>No sections yet.</p>";
    return;
  }

  const items = headings.map((heading) => {
    if (!heading.id) heading.id = slugify(heading.textContent);
    return `<a href="#${heading.id}" class="toc-link toc-link--${heading.tagName.toLowerCase()}">${heading.textContent}</a>`;
  });
  tocRoot.innerHTML = items.join("");
}

function initCodeCopy() {
  const blocks = document.querySelectorAll(".article-content pre, .page-body pre");
  blocks.forEach((block) => {
    if (block.parentElement && block.parentElement.classList.contains("code-block")) return;

    const code = block.querySelector("code");
    if (!code) return;

    const wrapper = document.createElement("div");
    wrapper.className = "code-block";
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    const button = document.createElement("button");
    button.className = "code-copy";
    button.type = "button";
    button.textContent = "Copy";
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.textContent = "Copied";
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1400);
      } catch (error) {
        button.textContent = "Failed";
      }
    });
    wrapper.appendChild(button);
  });
}

async function initSearch() {
  const root = document.querySelector("[data-search-root]");
  if (!root) return;

  const form = root.querySelector(".search-form");
  const input = root.querySelector("[data-search-input]");
  const resultsNode = root.querySelector("[data-search-results]");
  const statusNode = root.querySelector("[data-search-status]");
  const filters = Array.from(root.querySelectorAll("[data-filter]"));
  const searchIndex = root.dataset.searchIndex || "/search.json";
  let filter = "all";

  const response = await fetch(searchIndex);
  const entries = await response.json();
  const params = new URLSearchParams(window.location.search);
  const initialQuery = params.get("q") || "";

  function renderResults(query) {
    const term = query.trim().toLowerCase();
    let matches = entries;

    if (filter !== "all") {
      matches = matches.filter((entry) => entry.section === filter);
    }

    if (term) {
      matches = matches.filter((entry) => {
        const haystack = [entry.title, entry.summary, entry.content, (entry.tags || []).join(" ")]
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    if (!term) {
      statusNode.textContent = "Type to search the site.";
      resultsNode.innerHTML = "";
      return;
    }

    statusNode.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} found.`;

    resultsNode.innerHTML = matches
      .slice(0, 20)
      .map((entry) => {
        const tags = (entry.tags || [])
          .slice(0, 4)
          .map((tag) => `<span class="tag-chip">${tag}</span>`)
          .join("");

        return `
          <article class="search-result">
            <div class="article-meta">
              <span>${entry.date}</span>
            </div>
            <h3><a href="${entry.url}">${entry.title}</a></h3>
            <p>${entry.summary || ""}</p>
            <div class="tag-row">${tags}</div>
          </article>
        `;
      })
      .join("");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    const nextParams = new URLSearchParams(window.location.search);

    if (value) {
      nextParams.set("q", value);
    } else {
      nextParams.delete("q");
    }

    const nextQuery = nextParams.toString();
    const nextUrl = nextQuery ? `${window.location.pathname}?${nextQuery}` : window.location.pathname;
    window.history.replaceState({}, "", nextUrl);
    renderResults(value);
  });
  input.addEventListener("input", (event) => renderResults(event.target.value));
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filter = button.dataset.filter;
      filters.forEach((item) => item.classList.toggle("is-active", item === button));
      renderResults(input.value);
    });
  });

  if (initialQuery) {
    input.value = initialQuery;
  }
  renderResults(initialQuery);
}

function initDisqusLoader() {
  const root = document.querySelector("[data-comments-root]");
  const button = root && root.querySelector("[data-load-comments]");
  if (!root || !button) return;

  button.addEventListener("click", () => {
    if (window.DISQUS) return;

    const shortname = root.dataset.disqusShortname;
    window.disqus_config = function disqusConfig() {
      this.page.url = root.dataset.disqusUrl;
      this.page.identifier = root.dataset.disqusIdentifier;
    };

    const script = document.createElement("script");
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(+new Date()));
    
    script.onerror = () => {
      const errorMsg = document.createElement("p");
      errorMsg.style.color = "var(--accent)";
      errorMsg.textContent = "Comments failed to load. Please whitelist this site in your ad-blocker or tracking protection to view Disqus forums.";
      root.appendChild(errorMsg);
    };

    document.body.appendChild(script);
    button.remove();
  });
}

function initReadingProgress() {
  const wrapper = document.querySelector("[data-reading-progress]");
  const bar = document.querySelector("[data-reading-progress-bar]");
  const article = document.querySelector(".js-article-content");
  if (!wrapper || !bar || !article) return;

  const updateProgress = () => {
    const start = article.offsetTop;
    const total = article.scrollHeight - window.innerHeight;
    const current = Math.max(window.scrollY - start, 0);
    const progress = total > 0 ? Math.min((current / total) * 100, 100) : 0;
    bar.style.width = `${progress}%`;
    
    if (progress >= 100) {
      wrapper.setAttribute("data-exit", "bottom");
      wrapper.classList.remove("is-visible");
    } else if (progress <= 0) {
      wrapper.setAttribute("data-exit", "top");
      wrapper.classList.remove("is-visible");
    } else {
      wrapper.removeAttribute("data-exit");
      wrapper.classList.add("is-visible");
    }
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initHeaderSearch();
  initToc();
  initCodeCopy();
  initSearch();
  initDisqusLoader();
  initReadingProgress();
});
