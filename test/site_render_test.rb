require_relative "test_helper"

class SiteRenderTest < Minitest::Test
  def test_home_page_builds
    document = SiteBuildHelper.html_for("index.html")

    assert_equal "Nitish Jadia", document.at_css(".site-title h1")&.text&.strip
    assert document.at_css(".post-list"), "expected the home page to render the post list"
  end

  def test_markdown_headings_render_as_heading_elements
    document = SiteBuildHelper.find_html("2020/07/08/bitcoin-whitepaper*")

    h2 = document.at_css(".post-content h2")
    h3 = document.at_css(".post-content h3")

    assert_equal "Bitcoin: A Peer-to-Peer Electronic Cash System", h2&.text&.strip
    assert_equal "Introduction", h3&.text&.strip
  end

  def test_compiled_css_contains_explicit_post_heading_styles
    css = SiteBuildHelper.text_for_css

    assert_includes css, ".post-content h2"
    assert_includes css, ".post-content h3"
    assert_includes css, "font-size:2rem"
    assert_includes css, "font-size:1.5rem"
  end
end
