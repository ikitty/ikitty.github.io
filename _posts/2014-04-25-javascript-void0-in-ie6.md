---
layout: post
title: "javascript:void(0) causing connection aborted in IE6"
description: "微软已经放弃了WinXp，放弃了IE6，但国内还是有一部分用户依旧使用着IE6，虽然对于部分IE6中几px的差异表现已不再care，但我们还是得保证页面在IE6中的可用性。此文专门记录了在IE6中使用href='javascript:void(0)'带来的一些bug以及对应的解决方案"
tags: [ javascript, ie6 ]
category: Frontend
---
{% include JB/setup %}

微软已经放弃了WinXp，放弃了IE6，但国内还是有一部分用户依旧使用着IE6，虽然对于部分IE6中几px的差异表现已不再care，但我们还是得保证页面在IE6中的可用性。此文专门记录了在IE6中使用href='javascript:void(0)'带来的一些bug以及对应的解决方案

###Bug表现 

先看一段代码：

    <!DOCTYPE html>
    <html lang="ZH-cn">
    <head>
    <meta charset="utf-8" />
    <style type="text/css" media="screen">
        #ret {width:300px;height:300px;}
    </style>
    </head>
    <body>

    <a href="javascript:void();" id="link">Click Me to load Img </a>
    <div class="" id="ret"></div>

    <script type="text/javascript">
        document.getElementById('link').onclick = function () {
            var el = new Image;
            el.src = 'http://im-img.qq.com/home/img/q2013/qlogo.png';
            document.getElementById('ret').appendChild(el);
        }
    </script>
    </body>
    </html>

上面的Demo是一个很常见的功能：点击a标签，载入资源，并将资源填充到页面中。但是在IE6中运行该demo时，你会发现资源没有被载入，使用httpwatch抓包可以看到，这个资源请求被Aborted。在某些情况下，这可能会导致页面的重要功能意外终止，给用户体验大打折扣，尤其是在电商类网站，可能会直接给用户带来经济损失。

尤其变态的是：当页面还没有完整加载完时，如果用户快速频繁点击`href="javascript:void(0)"`的a标签，极有可能导致页面后续的资源都停止加载。 

###void(0)的前世今生

话说回来，为什么会有有`<a href="javascript:void(0)">Click</a>`这种写法呢？起源已无从考究。个人构思这种一个场景：页面中需要一个按钮，这个按钮有hover状态，点击之后还能实现相关功能，如果用a以外的标签（比如span标签），则无法在IE6中通过css实现hover态的效果（IE6中，大部分标签不支持:hover伪类），所以就只能用a标签，但是a标签本身是一个链接，默认就会有跳转动作，要保证a标签点击后不发生跳转行为，常规方法是将他的href属性赋值为'#'或者'###'。但这样便会污染部分浏览器的历史记录。理想状态是：点击a标签之后，页面不发生跳转，而且浏览器历史记录也没有该操作。于是乎，`href="javascript:void(0)"`应运而生。似乎解决了一切问题。

直到工程师们在使用Ajax动态载入一些资源时，发现IE6中总是无法载入资源。大家又开始重视`void(0)`带来的副作用。再来说说`void(0)`。

JavaScript中void是一个操作符，该操作符指定要计算一个表达式但是不返回值。对于`<a href="javascript:void(0)" onclick="loadImg();">`，当a标签被点击后，首先执行`loadImg`方法，然后执行`javascript:void(0)`(关于执行顺序，可以自行写demo测试)，问题出现了，IE6中，由于void(0)不返回任何值,这导致了`loadImg`中发出的资源请求被终止。所以，用户在IE6拼命点击按钮也看不到效果。

###解决方案

理清原因后，解决就容易多了。我们可以：

- 在a标签onclick绑定函数的尾部加入`return false;`来阻止浏览器的默认行为
- 使用span等其他标签来代替a标签，从根本上绕开`javascript:void(0)`，对应的，IE6中按钮的hover效果就优雅降级，或者你可以使用javascript动态加上hover态的class

方案代码如下：

    <!DOCTYPE html>
    <html lang="ZH-cn">
    <head>
    <meta charset="utf-8" />
    <style type="text/css" media="screen">
        #ret {width:300px;height:300px;}
    </style>
    </head>
    <body>

    <a href="javascript:void();" id="link">Click Me to load Img </a> 或者：
    <span onclick="loadImg()"">Click me </span>
    <div class="" id="ret"></div>

    <script type="text/javascript">
        document.getElementById('link').onclick = function () {
            var el = new Image;
            el.src = 'http://im-img.qq.com/home/img/q2013/qlogo.png';
            document.getElementById('ret').appendChild(el);

            //important
            return false;
        }
    </script>
    </body>
    </html>
