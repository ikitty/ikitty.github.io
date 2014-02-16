class: image
content_class: flexbox vcenter

![markdown](images/md.jpeg)

---

title: 1. Markdown是什么？
subtitle: &nbsp;
class: segue dark 

---

title: Markdown简介
class: big

John Gruber和Aaron Swartz创造了一种轻量级的标记语言。它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的XHTML(或者HTML)文档”。

---

title: 为什么推荐Markdown
class: big
build_lists: true

- 纯文本，兼容性强
- 易写、易读
- 格式转换方便
- 让用户更专注于内容，提升效率

---

title: 2. Markdown的应用场景
subtitle: &nbsp;
class: segue dark 

---

title: Markdown的应用场景
class: big
build_lists: true

- Wordpress 、StackOverflow、cNodeJs
- Gist (Github)
- Blog with jekyll
- [Evernote](http://trunk.yinxiang.com/app/maxiang/web-apps/)
- Slide show

---

title: 3. Markdown VS HTML
subtitle: &nbsp;
class: segue dark 

---

title: Markdown VS HTML
build_lists: true

- markdown不是要取代HTML，只对应HTML标记的一部分
- markdown让HTML书写起来更方便
- markdown兼容HTML，但HTML区块内的markdown标记不会被解析

---

title: Markdown VS HTML

下面这样的代码也是符合规范的：

    ##刀锋铁骑2014即将开战

    <table >
        <tr>
            <th>服务器</th>
            <th>大区</th>
        </tr>
        <tr>
            <td>状态-良好</td>
            <td>状态-拥挤</td>
        </tr>
    </table>

    刀锋铁骑<strong>专业大师团</strong>赏析

---

title: 4.1 Markdown语法
subtitle: 块级元素的描述
class: segue dark 

---

title: Markdown语法说明
build_lists: true

markdown的宗旨是为了让文档易读易写，所以其语法标记符号都是经过精心挑选，其作用一目了然：

- 比如用一对*包含起来的内容，看起来就像是要强调某个事物；
- 他的列表看起来就像是列表；
- 尖括号后面跟随的内容就是引用的内容。

---

title: Markdown语法 - 段落和换行
build_lists: true

- 一个Markdown段落是由一个或多个连续的文本行组成，它的前后要有一个以上的空行；
- 若要通过 Markdown 来插入 `&lt;br/&gt;` 标签的话，在插入处先按入两个以上的空格然后回车。

---

title: Markdown语法 - 标题
build_lists: true

- markdown支持两种标题语法，类`setext`和类`atx`形式
- 类`Setext`形式是用底线的形式，利用任意数量的= （最高阶标题）和- （第二阶标题），如：

---

title: Markdown语法 - 标题

<pre class="prettyprint" data-lang="markdown">

这是一级标题
=============


这是二级标题
-------------

</pre>

---

title: Markdown语法 - 标题

类`Atx`形式则是在标题前面插入适量的"\#"，1 至 6 个 "\#"表示一级至六级标题，如：

---

title: Markdown语法 - 标题
subtitle: &nbsp;

<pre class="prettyprint" data-lang="markdown">
#一级标题

##二级标题

###三级标题

####四级标题

#####五级标题

######六级标题
</pre>

---

title: Markdown语法 - 列表
subtitle: &nbsp;
build_lists: true

- markdown支持无序列表和有序列表
- 无序列表的标记为减号(`-`)、加号(`+`)或星号(`*`)

---

title: Markdown语法 - 列表
subtitle: &nbsp;
build_lists: true

<pre class="prettyprint" data-lang="markdown">
- 英雄联盟
- 刀锋铁骑
- 天涯明月刀
</pre>

<pre class="prettyprint" data-lang="markdown">
+ 英雄联盟
+ 刀锋铁骑
+ 天涯明月刀
</pre>

<pre class="prettyprint" data-lang="markdown">
* 英雄联盟
* 刀锋铁骑
* 天涯明月刀
</pre>

---

title: Markdown语法 - 列表

有序列表则使用数字接着一个点号(这里的数字不会影响实际的输出)，如：

<pre class="prettyprint" data-lang="markdown">
1. 英雄联盟
2. 刀锋铁骑
3. 天涯明月刀
</pre>

<pre class="prettyprint" data-lang="markdown">
4. 英雄联盟
1. 刀锋铁骑
9. 天涯明月刀
</pre>

<pre class="prettyprint" data-lang="markdown">
6. 英雄联盟
9. 刀锋铁骑
6. 天涯明月刀
</pre>

---

title: Markdown语法 - 列表

上面三段代码的装换成HTML的结果都是：


    <ol>
        <li>英雄联盟</li>
        <li>刀锋铁骑</li>
        <li>天涯明月刀</li>
    </ol>

---

title: Markdown语法 - 混排
subtitle: 列表中包含多个段落

有时候列表项中的内容比较复杂，包含多个段落。我们只需将每个项目下的段落都缩进4个空格或是 1 个制表符：

    1.  刀锋铁骑玩家协议第一部分 todo 
        
        不得使用各种外挂等

    2.  刀锋铁骑玩家协议第二部分
        
        玩家的各种装备。。。

---

title: Markdown语法 - 混排
subtitle: 列表中包含多个段落

    <ol>
        <li>
            <p>刀锋铁骑玩家协议第一部分 todo </p>
            <p>不得使用各种外挂等</p>
        </li>
        <li>
            <p>刀锋铁骑玩家协议第二部分</p>
            <p>玩家的各种装备。。。</p>
        </li>
    </ol>

---

title: Markdown语法 - 代码块

在 Markdown 中建立代码区块很简单，只要简单地缩进 4 个空格或是 1 个制表符即可。这个代码区块会持续到没有缩进的那一行

<pre class="prettyprint" data-lang="markdown">
这是普通段落
        
    /**
     * getSth
     **/
    var getSth = function () {
        return arguments ;
    }
</pre>

---

title: Markdown语法 - 代码块

    <p>这是普通段落</p>

    <pre><code>/**
     * getSth
     **/
    var getSth = function () {
        return arguments ;
    }
    </code></pre>

---

title: Markdown语法 - 引用

只需在整个段落的第一行最前面加上 ">" 即可，引用可以嵌套，也可以内嵌其他markdown标记
    
    > This is a blockquote with two paragraphs. Lorem ipsum dolor sit amet,
    consectetuer adipiscing elit. Aliquam hendrerit mi posuere lectus.
    Vestibulum enim wisi, viverra nec, fringilla in, laoreet vitae, risus.

    > Donec sit amet nisl. Aliquam semper ipsum sit amet velit. Suspendisse
    id sem consectetuer libero luctus adipiscing.

---

title: Markdown语法 - 分割线

在一行中用三个以上的星号、减号、底线来建立一个分隔线，行内不能有其他东西。下面每种写法都可以建立分隔线：

    ***

    *****

    ---

    --------

---

title: 4.2 Markdown语法
subtitle: 行内元素的描述
class: segue dark 

---

title: Markdown语法 - 链接
build_lists: true

Markdown 支持两种形式的链接语法，行内式和参考式两种形式:

行内式：

    点击[刀锋铁骑](http://t7.qq.com/ "前往刀锋铁骑官网")浏览网站
    
---

title: Markdown语法 - 链接
build_lists: true

参考式：在文件的任意处，你可以把这个标记的链接内容定义出来，然后在使用的时候指定对应的id即可，如：
  
    [id]: http://t7.qq.com "前往刀锋铁骑官网（可选）"
    点击[刀锋铁骑][id]浏览网站

如果一个页面中多次用到同样的链接，建议使用参考式。

---

title: Markdown语法 - 图片

和链接一样，图片也允许行内式和参考式，格式在链接前面多了一个"!"

    ![Alt text](path of picture)
    ![Alt text](path of picture "Optional title")

---

title: Markdown语法 - 图片

其参考式也和链接一样：

    [id]: url/to/image  "Optional title attribute"
    ![Alt text][id]
    
---

title: Markdown语法 - 强调

使用星号（*）和底线（_）作为标记强调字词的符号，被 * 或 _ 包围的字词会被转成用 `<em>` 标签包围，用两个 * 或 _ 包起来的话，则会被转成 `<strong>`，例如：

    *普通强调*
    _普通强调_
    

    **语气更强的强调**
    __语气更强的强调__
    
btw: 但是如果你的 * 和 _ 两边都有空白的话，它们就只会被当成普通的符号。

---

title: Markdown语法 - 行内代码

如果要标记一小段行内代码，你可以用反引号把它包起来（`），例如：

    hey, this is `<div>` tag .

转换成HTML的结果是：

    <p>hey, this is <code><div></code> tag.</p>

---

title: Markdown语法 - 反转义

如果你想使用markdown标记的自身的值，可以使用"\"来反转义markdown标记，如：

    \*刀锋铁骑\*

---

title: Markdown语法 - 反转义

markdown支持以下这些符号前面加上反斜杠来帮助插入普通的符号：

    \   反斜线
    `   反引号
    *   星号
    _   底线
    {}  花括号
    []  方括号
    ()  括弧
    #   井字号
    +   加号
    -   减号
    .   英文句点
    !   惊叹号

---

title: 5. markdown辅助工具
subtitle: &nbsp;
class: segue dark 

---

title: Markdown辅助工具
build_lists: true

- 编辑器类
    - Mou for mac
    - MarkdownPad for windows
    - MarkPad for windows
    - ReText for Linux
- 工具类
    - Pandoc
    - [Showdown](http://softwaremaniacs.org/playground/showdown-highlight/)
    - Markable.in online
    - Dillinger.io online
    - Dingus online

---

title: About Markdown
build_lists: true

- markdown简介
- markdown的特点
- markdown的应用场景
- markdown语法介绍和示例
- markdown辅助工具

