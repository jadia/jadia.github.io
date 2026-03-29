# _plugins/git_metadata.rb
# Fetches the last modified time from Git for each post/page.
# Requires git to be installed and the repository to have history (fetch-depth: 0).

module GitMetadata
  def self.set_last_modified(item)
    if File.directory?(".git")
      last_modified = `git log -1 --format=%ct -- "#{item.path}"`.strip
      if !last_modified.empty?
        item.data['last_modified_at'] = Time.at(last_modified.to_i)
        return
      end
    end
    # Fallback for local testing or shallow clones when git log is empty
    if File.exist?(item.path)
      item.data['last_modified_at'] = File.mtime(item.path)
    end
  end
end

Jekyll::Hooks.register :posts, :pre_render do |post|
  GitMetadata.set_last_modified(post)
end

Jekyll::Hooks.register :pages, :pre_render do |page|
  GitMetadata.set_last_modified(page)
end
