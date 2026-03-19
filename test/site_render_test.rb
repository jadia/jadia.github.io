require_relative "test_helper"

class SiteRenderTest < Minitest::Test
  def test_home_page_builds_with_latest_content
    document = SiteBuildHelper.html_for("index.html")

    brand_name = document.at_css(".site-brand-copy strong")&.text&.strip
    brand_logo_src = document.at_css(".site-brand-mark img")&.[]("src")

    refute_empty brand_name, "expected the author brand name to be dynamically rendered"
    refute_nil brand_logo_src, "expected the author brand logo image element to be present"
    refute_empty brand_logo_src, "expected the author brand logo image source attribute to not be empty"

    assert_equal "Latest", document.at_css(".home-section--timeline .section-kicker")&.text&.strip
    assert document.at_css("[data-header-search]"), "expected the header to render the compact search control"
    assert document.at_css(".home-section--timeline .content-card"), "expected the home page to render the chronological feed"
  end

  def test_search_index_and_page_exist
    search_page = SiteBuildHelper.html_for("search", "index.html")
    search_index = SiteBuildHelper.json_for("search.json")

    assert search_page.at_css("[data-search-root]"), "expected the search page root"
    refute_empty search_index
    assert search_index.any? { |entry| entry["section"] == "posts" }
    refute search_page.at_css("[data-filter='notes']"), "notes filters should be removed in post-only mode"
  end

  def test_markdown_headings_and_toc_container_render
    document = SiteBuildHelper.find_html("2020/07/08/bitcoin-whitepaper*/index.html")

    assert_equal "Bitcoin: A Peer-to-Peer Electronic Cash System", document.at_css(".article-content h2")&.text&.strip
    assert_equal "Introduction", document.at_css(".article-content h3")&.text&.strip
    assert document.at_css(".js-article-toc"), "expected a TOC container on article pages"
    assert document.at_css("[data-reading-progress]"), "expected a reading progress bar on article pages"
  end

  def test_compiled_css_contains_theme_and_article_styles
    css = SiteBuildHelper.text_for_css

    assert_includes css, ".site-brand-mark"
    assert_includes css, ".header-search"
    assert_includes css, ".article-content h2"
    assert_includes css, ".theme-toggle"
    assert_includes css, ".reading-progress"
  end

  def test_legacy_collection_routes_redirect_to_archive
    notes = SiteBuildHelper.html_for("notes.html")
    guides = SiteBuildHelper.html_for("guides.html")

    notes_redirect = notes.at_css("meta[http-equiv='refresh']")&.[]("content")&.split("url=")&.last
    guides_redirect = guides.at_css("meta[http-equiv='refresh']")&.[]("content")&.split("url=")&.last

    assert notes_redirect&.end_with?("/archive"), "expected /notes redirect to archive"
    assert guides_redirect&.end_with?("/archive"), "expected /guides redirect to archive"
  end
end
