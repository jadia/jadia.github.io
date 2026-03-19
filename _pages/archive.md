---
layout: page
title: Archive
permalink: /archive
description: Chronological archive of technical posts.
---

{% assign all_content = site.posts | sort: "date" | reverse %}
{% assign posts_by_year = all_content | group_by_exp: "entry", "entry.date | date: '%Y'" %}

<div class="archive-stack">
  {% for year in posts_by_year %}
    <section class="archive-group">
      <h2 class="archive-year">{{ year.name }}</h2>
      <div class="archive-list">
        {% for entry in year.items %}
          {% include article-card.html item=entry compact=true %}
        {% endfor %}
      </div>
    </section>
  {% endfor %}
</div>
