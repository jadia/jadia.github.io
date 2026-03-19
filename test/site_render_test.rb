require_relative "test_helper"

class SiteRenderTest < Minitest::Test
  # Verifies that the home page renders the author's branding, latest chronological feed, 
  # and the compact header search control correctly.
  def test_home_page_builds_with_latest_content
    document = SiteBuildHelper.html_for("index.html")

    assert_equal "Nitish Jadia", document.at_css(".site-brand-copy strong")&.text&.strip
    assert_equal "/circle-cropped.png", document.at_css(".site-brand-mark img")&.[]("src")
    assert_equal "Latest", document.at_css(".home-section--timeline .section-kicker")&.text&.strip
    assert document.at_css("[data-header-search]"), "expected the header to render the compact search control"
    assert document.at_css(".home-section--timeline .content-card"), "expected the home page to render the chronological feed"
  end

  # Ensures the search JSON API is generated with valid post entries and that the 
  # visual /search route renders without legacy collection filters (like notes).
  def test_search_index_and_page_exist
    search_page = SiteBuildHelper.html_for("search", "index.html")
    search_index = SiteBuildHelper.json_for("search.json")

    assert search_page.at_css("[data-search-root]"), "expected the search page root"
    refute_empty search_index
    assert search_index.any? { |entry| entry["section"] == "posts" }
    refute search_page.at_css("[data-filter='notes']"), "notes filters should be removed in post-only mode"
  end

  # Validates that an actual markdown article compiles correctly into HTML with expected
  # H2/H3 tags, and that dynamic JavaScript hooks (TOC, reading progress) are injected.
  def test_markdown_headings_and_toc_container_render
    document = SiteBuildHelper.find_html("2020/07/08/bitcoin-whitepaper*/index.html")

    assert_equal "Bitcoin: A Peer-to-Peer Electronic Cash System", document.at_css(".article-content h2")&.text&.strip
    assert_equal "Introduction", document.at_css(".article-content h3")&.text&.strip
    assert document.at_css(".js-article-toc"), "expected a TOC container on article pages"
    assert document.at_css("[data-reading-progress]"), "expected a reading progress bar on article pages"
  end

  # Confirms that the SCSS preprocessor successfully bundled the components into the 
  # final minified CSS payload.
  def test_compiled_css_contains_theme_and_article_styles
    css = SiteBuildHelper.text_for_css

    assert_includes css, ".site-brand-mark"
    assert_includes css, ".header-search"
    assert_includes css, ".article-content h2"
    assert_includes css, ".theme-toggle"
    assert_includes css, ".reading-progress"
  end

  # Tests that deprecated paths like /notes and /guides gracefully HTTP-refresh 
  # redirect users to the primary /archive page.
  def test_legacy_collection_routes_redirect_to_archive
    notes = SiteBuildHelper.html_for("notes.html")
    guides = SiteBuildHelper.html_for("guides.html")

    notes_redirect = notes.at_css("meta[http-equiv='refresh']")&.[]("content")&.split("url=")&.last
    guides_redirect = guides.at_css("meta[http-equiv='refresh']")&.[]("content")&.split("url=")&.last

    assert notes_redirect&.end_with?("/archive"), "expected /notes redirect to archive"
    assert guides_redirect&.end_with?("/archive"), "expected /guides redirect to archive"
  end

  # Verifies that social media links natively inject the security-conscious
  # target="_blank" attributes to prevent same-tab navigation away from the blog.
  def test_footer_social_links_open_in_new_tab
    document = SiteBuildHelper.html_for("index.html")
    
    social_links = document.css(".social-links .social-link")
    refute_empty social_links, "Expected to find social links in the footer"
    
    social_links.each do |link|
      assert_equal "_blank", link["target"], "Social link #{link['href']} must open in a new tab"
      assert_includes link["rel"].to_s, "noopener", "Social link #{link['href']} must have rel='noopener' for security"
      assert_includes link["rel"].to_s, "noreferrer", "Social link #{link['href']} must have rel='noreferrer' for security"
    end
  end

  # Validates that the Disqus comment block layout compiles with the correct
  # dataset attributes and empty thread container strictly required by the lazy-loading script.
  def test_article_disqus_container_renders_correctly
    document = SiteBuildHelper.find_html("2020/07/08/bitcoin-whitepaper*/index.html")
    
    comments_panel = document.at_css("[data-comments-root]")
    assert comments_panel, "Expected a Disqus comments root panel on the article"
    
    # Verify the config-driven shortname is correctly populated into the JS dataset hook
    assert_equal "jadia-dev", comments_panel["data-disqus-shortname"]
    
    # Verify the lazy-load manual trigger button and the injection target div are present
    assert document.at_css("[data-load-comments]"), "Expected a manual button to load comments"
    assert document.at_css("#disqus_thread"), "Expected the empty Disqus thread injection div"
  end
end
