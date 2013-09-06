{% for post in category_posts %}
<div class="cate_item">
    <a href="{{ post.url }}">{{ post.title }}</a>
</div>
{% endfor %}
