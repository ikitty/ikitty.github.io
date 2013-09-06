---
layout: page
title: iKitty Notes
---
{% include JB/setup %}

<style type="text/css" media="screen">
    .page-header {display:none;}
</style>

<ul class="posts">
  {% for post in site.posts %}
    <li>
        <div class="post_tit">
            <span class="post_time">{{ post.date | date: "%Y-%m-%d" }} &raquo; </span>
            <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a>
        </div>
        <p class="post_desp">{{post.description}}</p>
    </li>
  {% endfor %}
</ul>
