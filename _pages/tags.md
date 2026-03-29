---
layout: page
title: Tags
permalink: /tags
---

{% assign all_content = site.posts | sort: "date" | reverse %}
{% assign all_tags = "" | split: "" %}
{% for entry in all_content %}
  {% assign all_tags = all_tags | concat: entry.tags %}
{% endfor %}
{% assign tag_words = all_tags | uniq | sort %}

<div class="page-intro">
  <p class="section-kicker">{{ tag_words.size }} Topics</p>
  <h1 class="page-title">Browse by Tag</h1>
  <p class="page-tagline">Explore technical posts organized by deep-dive topics, tools, and methodologies.</p>
</div>

<div class="tag-cloud">
  {% for tag in tag_words %}
    {% assign tag_count = 0 %}
    {% for entry in all_content %}
      {% if entry.tags contains tag %}
        {% assign tag_count = tag_count | plus: 1 %}
      {% endif %}
    {% endfor %}
    <a class="tag-chip" href="#{{ tag | slugify }}">{{ tag }} <span>{{ tag_count }}</span></a>
  {% endfor %}
</div>

<div class="tag-sections">
  {% for tag in tag_words %}
    <section id="{{ tag | slugify }}" class="tag-section">
      <div class="section-heading">
        <p class="section-kicker">Tag</p>
        <h2 class="tag-title">{{ tag }}</h2>
      </div>
      <div class="archive-list">
        {% for entry in all_content %}
          {% if entry.tags contains tag %}
            {% include article-card.html item=entry compact=true %}
          {% endif %}
        {% endfor %}
      </div>
    </section>
  {% endfor %}
</div>
