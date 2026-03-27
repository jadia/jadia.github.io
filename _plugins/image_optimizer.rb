# frozen_string_literal: true
require 'fileutils'

puts "LOADING image_optimizer plugin..."

module WebpImageConverter
  def self.cwebp_available?
    @cwebp_available ||= system("which cwebp > /dev/null 2>&1")
  end
end

Jekyll::Hooks.register :site, :post_write do |site|
  if WebpImageConverter.cwebp_available?
    cache_dir = File.join(site.source, '.jekyll-cache', 'webp')
    FileUtils.mkdir_p(cache_dir)
    
    converted_count = 0

    site.static_files.each do |file|
      url_path = file.url
      next unless url_path =~ /\.(png|jpg|jpeg)$/i

      source_path = file.path
      next unless File.exist?(source_path)
      
      # Skip the site-wide social image to maintain JPEG compatibility for social crawlers
      next if url_path.include?('orion-nebula.jpg')

      # Determine if png (lossless) or jpg (lossy)
      is_png = source_path =~ /\.png$/i
      
      # Keep track of where things go in the cache to mirror the source structure
      relative_dir = File.dirname(file.relative_path)
      webp_filename = File.basename(file.relative_path).sub(/\.(png|jpg|jpeg)$/i, '.webp')
      
      cached_webp_dir = File.join(cache_dir, relative_dir)
      FileUtils.mkdir_p(cached_webp_dir)
      cached_webp_path = File.join(cached_webp_dir, webp_filename)

      # Check if we need to convert
      needs_conversion = !File.exist?(cached_webp_path) || File.mtime(source_path) > File.mtime(cached_webp_path)

      if needs_conversion
        # Lossless for PNGs (great for screenshots), lossy for JPGs
        if is_png
          # -lossless -z 6 for max compression, preserving text perfectly for technical blog screenshots
          command = "cwebp -quiet -lossless -z 6 \"#{source_path}\" -o \"#{cached_webp_path}\""
        else
          # -q 85 for good quality/size trade-off for photos
          command = "cwebp -quiet -q 85 \"#{source_path}\" -o \"#{cached_webp_path}\""
        end
        system(command)
        converted_count += 1
      end

      # 2. Copy the cached WebP to the final _site destination
      dest_dir = File.dirname(file.destination(site.dest))
      FileUtils.mkdir_p(dest_dir)
      FileUtils.cp(cached_webp_path, File.join(dest_dir, webp_filename))
    end
    
    puts "Jekyll WebP: Executed conversions for #{converted_count} new/updated images." if converted_count > 0
  else
    puts "⚠️ Jekyll WebP: 'cwebp' not found installed on machine. Skipping WebP conversion."
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |doc|
  if WebpImageConverter.cwebp_available? && doc.output
    # Replace <img src="...">, <link href="...">, <meta content="..."> pointing to local images
    doc.output = doc.output.gsub(/(src|href|content)=["']([^"']+\.(png|jpg|jpeg))["']/i) do |match|
      prefix = $1
      url = $2
      
      # Determine if the URL is local (skip external)
      site_url = doc.site.config['url'].to_s
      is_external = url.start_with?('http://', 'https://', '//') && (!site_url.empty? ? !url.include?(site_url) : true)
      
      if is_external || url.include?('orion-nebula.jpg')
        match
      else
        "#{prefix}=\"#{url.sub(/\.(png|jpg|jpeg)$/i, '.webp')}\""
      end
    end

    # Replace CSS background-image: url('...')
    doc.output = doc.output.gsub(/url\(["']?([^"')]+\.(png|jpg|jpeg))["']?\)/i) do |match|
      url = $1
      site_url = doc.site.config['url'].to_s
      is_external = url.start_with?('http://', 'https://', '//') && (!site_url.empty? ? !url.include?(site_url) : true)
      
      if is_external
        match
      else
        "url('#{url.sub(/\.(png|jpg|jpeg)$/i, '.webp')}')"
      end
    end
  end
end
