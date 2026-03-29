module Jekyll
  class CalloutBlock < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @type = tag_name
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(Jekyll::Converters::Markdown)
      content = converter.convert(super)
      
      icon = case @type
             when 'tip'
               '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
             when 'note'
               '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
             when 'warning'
               '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>'
             else
               ''
             end

      title = @type.capitalize

      <<~HTML
        <div class="callout callout--#{@type}">
          <div class="callout-header">
            <span class="callout-icon">#{icon}</span>
            <strong class="callout-title">#{title}</strong>
          </div>
          <div class="callout-content">
            #{content}
          </div>
        </div>
      HTML
    end
  end
end

Liquid::Template.register_tag('tip', Jekyll::CalloutBlock)
Liquid::Template.register_tag('note', Jekyll::CalloutBlock)
Liquid::Template.register_tag('warning', Jekyll::CalloutBlock)
