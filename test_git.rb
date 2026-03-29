require 'fileutils'
if File.directory?(".git")
  last_modified = `git log -1 --format=%ct -- "_posts/2021-08-15-Expose_Raspberry_Pi_to_the_Internet_using_Cloudflare_Tunnel.md"`.strip
  puts "Timestamp: '#{last_modified}'"
  if last_modified.empty?
    puts "Wait, the file exists: #{File.exist?("_posts/2021-08-15-Expose_Raspberry_Pi_to_the_Internet_using_Cloudflare_Tunnel.md")}"
    puts `git status`
  end
else
  puts ".git not found"
end
