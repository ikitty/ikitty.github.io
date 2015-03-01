---
layout: post
title: "Backbone.js学习记录"
description: "好记性不如乱笔头，一边学习backbone，一边整理记录自己的心得。backbone是一个轻量级的前端MVC库，正如其名，它能帮你快速的搭建起整个网站应用的骨架。backbone提供了一套web开发的框架，通过Models进行key-value绑定及自定义事件处理，通过Collections提供一套丰富的API用于枚举功能，通过Views来进行事件处理及与现有的Application通过RESTful JSON接口进行交互."
category: other
tags: []
---
{% include JB/setup %}


好记性不如乱笔头，一边学习backbone，一边整理记录自己的心得。backbone是一个轻量级的前端MVC库，正如其名，它能帮你快速的搭建起整个网站应用的骨架。backbone提供了一套web开发的框架，通过Models进行key-value绑定及自定义事件处理，通过Collections提供一套丰富的API用于枚举功能，通过Views来进行事件处理及与现有的Application通过RESTful JSON接口进行交互.

Backbone可以轻松将页面中的数据、逻辑、视图解耦，依照Backbone进行代码结构组织，便于同事间同时进行项目中的数据交互、业务逻辑、用户界面等工作，这对于大型和复杂项目的维护开发非常有帮助。


###基本概念

backbone主要包含了Model，Collection，view，router几部分， 下面将其名称和对应的基本概念依次列出：

- router，路由管理，根据URL来决定应用的动作（action）
- model，抽象的数据模型，相当于数据表中的一条记录
- collection，模型的集合，相当于一个数据表（包含多条记录）
- view，视图层——web端UI层，以及UI层的交互行为实现，并在其中实现和model的双向绑定

###大致处理流程

对于一个简单的单页应用（SPA），当用户通过URL访问应用时，首先backbone的router根据URL来触发对应的处理函数（action），在这个action中，collection向服务端获取数据（fetch），在view层中，监听collection的函数检测到数据发生变化时，会将最新的数据结合指定的模板（DOM）渲染出来展示给用户。另外，在view层中，也会有专门的函数去监听用户在界面中的交互操作，并根据用户的交互行为去处理对应的数据。backbone就这样的完成了model和view的绑定。


###模板解析

由于backbone依赖underscore，我们可以直接在html中很方便的定义混有嵌入JS数据的模板。并通过underscore的模板解析引擎来渲染。


###使用场景

Backbone并不像jQuery那样具有非常通用，如果你的网站没有复杂的逻辑和结构，backbone不一定合适。如果你正准备构建一个大型或复杂的单页Web应用，那么Backbone再适合不过。

如果你的项目并不复杂，但你却深深喜欢它的某个特性(可能是数据模型、视图管理或路由器)，那么你可以将这部分源码从Backbone中抽取出来，因为在Backbone中，各模块间的依赖并不是很强，你能轻易的获取并使用其中的某一个模块。

接下来逐个说明Model、collection和view。
