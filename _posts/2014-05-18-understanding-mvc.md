---
layout: post
title: "iOS中的MVC"
description: "无论前端开发，还是搞后端的同学不会对MVC陌生，MVC是基于一个很重要的概念——关注点分离（SoC）。它鼓励开发者将一个应用的特性分离成多个各负其责的小块。iOS开发中常见的委托模式就是应用SoC的很好的例子。"
tags: [ Objective-c, mvc ]
category: iOS
---
{% include JB/setup %}

无论前端开发，还是搞后端的同学不会对MVC陌生，MVC是基于一个很重要的概念——Separation of Concerns（SoC）。它鼓励开发者将一个应用的特性分离成多个各负其责的小块，以达到更高层次的抽象。iOS开发中常见的委托模式就是应用SoC的很好的例子。

##MVC

根据字面意思不难看出，MVC由Model, View, Controller三个部分组成。是一种广泛应用于编程语言的模式，比如Java等。下面结合iOS开发中实际情况来分别说说三个组成部分。

###Model

model负责保存数据，并对数据做一系列操作。比如：在model中保存一个列表的数据，并保存对这个列表的C、R、U、D操作。

###View

view - 视图，它负责界面的信息呈现，比如将一个列表信息以表格的形式展示出来。

###Controller

controller - 控制器，它是连接Model和View的桥梁。它将用户在视图中的操作传递给相应的Model中。比如：用户点击了一个列表，Controller要在Model中触发一个对应的动作（标记当前对象为已选择状态）,然后，还要告诉View去更新状态（给当前对象显示一个已选择的标记）。

下面的这张图或许能更好的帮我们去理解MVC：

![MVC](/images/mvc.jpg )

上图对应的文本流程描述为：

- view: 调用cellForRowAtIndexPath (view要显示一行内容啦)
- controller: 把这个请求传递到model中，并在model中获取一行数据
- model：将处理好的数据返回给controller
- controller: 传输数据给view，并让view展示数据

###通信规则

上面展示的流程图展示来MVC各个部分的通信流程，另外，还是一些规则也是必须遵守的：

- controller 可和model或view直接通信
- model和view不能直接通信
- view和controller的通信主要是靠outlet(对应类中的属性)关联,通信方式:
    - 设置action（响应user event）
    - 设置delegate，如UITableViewDelegate
    - 设置dataSource来获取数据

据部分资料提到，iOS 还提供了Action-Target 模式来让Controller 监听View 触发的事件。(待亲测)
