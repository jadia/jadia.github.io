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
    return `<a href="#${heading.id}" class="toc-link toc-link--${heading.tagName.toLowerCase()}" data-heading-id="${heading.id}">${heading.textContent}</a>`;
  });
  tocRoot.innerHTML = items.join("");

  // ScrollSpy logic
  const isEnabled = document.documentElement.dataset.tocScrollspy === "true";
  if (!isEnabled || !window.IntersectionObserver) return;

  const tocLinks = Array.from(tocRoot.querySelectorAll(".toc-link"));
  const observerOptions = {
    rootMargin: "-20% 0% -70% 0%",
    threshold: 0,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        tocLinks.forEach((link) => {
          const isActive = link.dataset.headingId === entry.target.id;
          link.classList.toggle("is-active", isActive);
          if (isActive) {
            // Ensure the active link is visible in the scrollable TOC card
            link.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        });
      }
    });
  }, observerOptions);

  headings.forEach((heading) => observer.observe(heading));
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
    button.setAttribute("aria-label", "Copy code");
    
    const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    button.innerHTML = copyIcon;
    
    button.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code.innerText);
        button.innerHTML = checkIcon;
        button.style.color = "var(--highlight)";
        setTimeout(() => {
          button.innerHTML = copyIcon;
          button.style.color = "";
        }, 1400);
      } catch (error) {
        // Fallback or ignore
      }
    });
    wrapper.appendChild(button);
  });
}

function initDeepLinks() {
  const headings = document.querySelectorAll(".article-content h2, .article-content h3, .article-content h4, .page-body h2, .page-body h3, .page-body h4");
  
  headings.forEach((heading) => {
    if (!heading.id) return;
    
    const wrapper = document.createElement("span");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-flex";
    wrapper.style.alignItems = "center";
    
    const link = document.createElement("a");
    link.href = `#${heading.id}`;
    link.className = "heading-anchor";
    link.setAttribute("aria-label", "Copy link to section");
    link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
    
    const label = document.createElement("span");
    label.className = "heading-anchor-label";
    label.textContent = "Copied!";
    
    link.addEventListener("click", async (e) => {
      e.preventDefault();
      const url = new URL(window.location.href);
      url.hash = heading.id;
      window.history.pushState(null, null, url.toString());
      try {
        await navigator.clipboard.writeText(url.toString());
        link.classList.add("is-copied");
        label.classList.add("is-visible");
        setTimeout(() => {
          link.classList.remove("is-copied");
          label.classList.remove("is-visible");
        }, 1500);
      } catch (err) {}
    });
    
    wrapper.appendChild(link);
    wrapper.appendChild(label);
    heading.appendChild(wrapper);
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
    const skeleton = root.querySelector("[data-comments-skeleton]");
    if (skeleton) skeleton.classList.remove("is-hidden");

    window.disqus_config = function disqusConfig() {
      this.page.url = root.dataset.disqusUrl;
      this.page.identifier = root.dataset.disqusIdentifier;
      this.callbacks.onReady = [
        function () {
          if (skeleton) skeleton.classList.add("is-hidden");
        },
      ];
    };

    const script = document.createElement("script");
    script.src = `https://${shortname}.disqus.com/embed.js`;
    script.setAttribute("data-timestamp", String(+new Date()));
    
    script.onerror = () => {
      if (skeleton) skeleton.classList.add("is-hidden");
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
  initDeepLinks();
});
