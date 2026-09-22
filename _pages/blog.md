---
layout: default
permalink: /blog/
title: 笔记
nav: true
nav_order: 2
pagination:
  enabled: true
  collection: posts
  permalink: /page/:num/
---

<!-- pages/blog.md -->
<div class="post-list">
{% for post in paginator.posts %}
  <article class="post-preview">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    {% if post.description %}<p class="text-muted">{{ post.description }}</p>{% endif %}
    <p class="post-meta">{{ post.date | date: '%Y-%m-%d' }}</p>
  </article>
{% endfor %}
</div>
{% if paginator.total_pages > 1 %}
<nav aria-label="Page navigation">
  <ul class="pagination justify-content-center">
    {% if paginator.previous_page %}<li class="page-item"><a class="page-link" href="{{ paginator.previous_page_path | relative_url }}">«</a></li>{% endif %}
    {% if paginator.next_page %}<li class="page-item"><a class="page-link" href="{{ paginator.next_page_path | relative_url }}">»</a></li>{% endif %}
  </ul>
</nav>
{% endif %}
