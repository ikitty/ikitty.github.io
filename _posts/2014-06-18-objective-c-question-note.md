---
layout: post
title: "学习Objective C遇到的问题"
description: "新手去搞iOS开发总会遇到很多莫名其妙的问题，在此记录这些坑。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

新手去搞iOS开发总会遇到很多莫名其妙的问题，在此记录这些坑。

###Launch images

Launch images 是iOS app启用时的界面，也有人叫做闪屏（splash screen）。为应用添加一个闪屏很简单。首先用图片处理软件制作闪屏图片,尺寸是320x480，格式必须是png，保存为你喜欢的图片名称，比如：start.png ，然后为retina屏幕制作一个双倍尺寸(640x960)的图片。命名为start@2x.png，其中`@2X`是给拥有retina屏幕设备使用的一个标记。

将两个图片文件导入到项目中，并打开项目对应的plist文件，新增属性“Launch image” ,属性值就是图片名称“start” (不需要后缀和@2X标记)。但是当我再次run起应用时，却没有出现我期待的闪屏。这是咋么回事。网上也没有找到相关的资料，后来，我在应用的概要信息 (general tab) 中发现，xCode5.1 会默认引用系统资源作为闪屏，所以我们只要在Launch images这个栏目选择 "donnot use asset catelog" 就好了。

xCode每次升级都会带来很多新东西，但是有些改变也是我们要去了解的，不然就会出现上面的情况。

###iOS何时使用self.
