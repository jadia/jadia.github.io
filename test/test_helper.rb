require "fileutils"
require "json"
require "minitest/autorun"
require "nokogiri"
require "open3"
require "tmpdir"

module SiteBuildHelper
  module_function

  def build_site
    return @build_dir if defined?(@build_dir) && @build_dir

    @build_dir = Dir.mktmpdir("jadia-site-")
    env = { "JEKYLL_ENV" => "test" }
    cmd = [
      "bundle",
      "exec",
      "jekyll",
      "build",
      "--trace",
      "--destination",
      @build_dir
    ]

    stdout, stderr, status = Open3.capture3(env, *cmd)
    return @build_dir if status.success?

    raise <<~MSG
      Jekyll build failed with exit code #{status.exitstatus}
      STDOUT:
      #{stdout}

      STDERR:
      #{stderr}
    MSG
  end

  def html_for(*segments)
    path = File.join(build_site, *segments)
    Nokogiri::HTML(File.read(path))
  end

  def find_html(glob)
    matches = Dir.glob(File.join(build_site, glob))
    raise "No built HTML file matched #{glob}" if matches.empty?

    Nokogiri::HTML(File.read(matches.first))
  end

  def text_for_css
    File.read(File.join(build_site, "assets", "main.css"))
  end

  def json_for(*segments)
    JSON.parse(File.read(File.join(build_site, *segments)))
  end
end
