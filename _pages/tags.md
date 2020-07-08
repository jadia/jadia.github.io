---
layout: page
title: Tags
permalink: /tags
---

{% assign til_tags =  site.til | map: 'tags' | uniq %}
{% assign howto_tags =  site.howto | map: 'tags' | uniq %}

{%- capture site_tags -%}
  {%- for tag in site.tags -%}
    {{ tag | first }}{% unless forloop.last %},{%- endunless -%}
  {% endfor %}
{%- endcapture -%}

{% assign post_tags = site_tags | split: ',' | sort %}

{% assign tag_words = post_tags | concat: til_tags | uniq %}

{% assign tag_words = post_tags | concat: howto_tags | uniq %}

{% assign grouped_til_tags = site.til | map: 'tags' | join: ',' | split: ',' | group_by: tag %}

<div class="page-tags">
  {% for item in (0..tag_words.size) %}{% unless forloop.last %}
  {% assign tag = tag_words[item] %}
  {% assign til_tag = grouped_til_tags | where:"name", tag | first %}
    <a class="page-tag" href="/tags#{{ tag | cgi_escape }}">{{ tag }} ({{ site.tags[tag].size | plus: til_tag.size }})  </a>
  {% endunless %}{% endfor %}
</div>


<!-- Posts by Tag -->
<div>
  {% for item in (0..tag_words.size) %}{% unless forloop.last %}
    {% capture this_word %}{{ tag_words[item] }}{% endcapture %}
    <div class="tag-content">
      <h2 id="{{ this_word | cgi_escape }}" class="tag-title">{{ this_word }}</h2>
      {% for post in site.tags[this_word] %}{% if post.title != null %}
        <div class="tags-post">
            <div class="post-subheader post-type">
              <span>Post</span>
            </div>
            <a class="post-link" href="{{ post.url | relative_url }}">
              {{ post.title | escape }}
            </a>
            {% assign page_content = post %}
            {% include post-subheader.html %}
        </div>
      {% endif %}{% endfor %}

      {% for til in site.til %}
        {% if til.tags contains this_word %}
          <div class="tags-post">
            <div class="post-subheader til-type">
              <span>Today I Learned</span>
            </div>
            <a class="post-link" href="{{ til.url | relative_url }}">
              {{ til.title | escape }}
            </a>
            {% assign page_content = til %}
            {% include post-subheader.html %}
          </div>
        {% endif %}
      {% endfor %}
      
        {% for howto in site.howto %}
        {% if howto.tags contains this_word %}
          <div class="tags-post">
            <div class="post-subheader howto-type">
              <span>Today I Learned</span>
            </div>
            <a class="post-link" href="{{ howto.url | relative_url }}">
              {{ howto.title | escape }}
            </a>
            {% assign page_content = howto %}
            {% include post-subheader.html %}
          </div>
        {% endif %}
      {% endfor %}
    </div>
  {% endunless %}{% endfor %}
</div>