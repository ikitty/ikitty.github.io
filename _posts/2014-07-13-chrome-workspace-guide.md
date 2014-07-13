---
layout: post
title: "chrome workspace guide"
description: "最近接手了一些其他业务的活动内容，这些活动的设计稿有个共同点，在一个页面中有很多popup，而每个popup的触发点都是不规则地分布在页面中的一些位置。我不得不在chrome develop tool中的逐个调整触发点的大小和位置，然后在CSS文件中再依次写入这些属性。三五个触发点倒无所谓，三五十个触发点就足够让人郁闷了。同事介绍说可用chrome开发工具的workspace特性解决这个问题。workspace帮助开发者将develop tool中调整后的样式自动写入到对应的CSS文件中，省去重复编辑CSS文件的繁琐。"
category: Frontend
tags: [chrome, webkit, debug]
---
{% include JB/setup %}

最近接手了一些其他业务的活动内容，这些活动的设计稿有个共同点，在一个页面中有很多popup，而每个popup的触发点都是不规则地分布在页面中的一些位置。我不得不在chrome developer tool中的逐个调整触发点的大小和位置，然后在CSS文件中再依次写入这些属性。三五个触发点倒无所谓，三五十个触发点就足够让人郁闷了。同事介绍说可用chrome开发工具的workspace特性解决这个问题。workspace帮助开发者将develop tool中调整后的样式自动写入到对应的CSS文件中，省去重复编辑CSS文件的繁琐。

顺便说一句，只要是基于较新webkit内核的浏览器都支持workspace，由于该特性之前都是以开发者实验功能出现的。所以在低版本的chrome中，你可能要在`chrome://flags`中手动启用Enable Developer Tools experiments. （貌似chrome33之后的版本就不用去启用）

###设置workspace

在chrome按F12打开developer tools，点击右侧“齿轮”图标进入设置界面。切换到workspace选项卡，点击“Add folder...”,选择你期待加入workspace的项目文件夹。此时浏览器顶部会出现一个警告提示，点击"允许"(这样chrome才拥有对文件的写权限)。

![map](/images/workspace-allow-edit.jpg)

###设置映射规则

之前看到的一些指引都是让你选中刚添加的workspace，点击“edit”手动编辑映射规则。但是对于还处于开发阶段的本地项目，完全没必要去手动写规则（一开始我也坑在这里，后来发现是规则写的不正确）

于是发现这里自动映射的。点击控制台的source，找到你要映射的CSS文件，右击它，选择“Map to filesystem resource...”

![map](/images/workspace-auto-map1.jpg)

默认会自动关联到添加到workspace中的对应的样式文件，选中对应的文件。此时会提示是否重启inspector，确认即可。

![map](/images/workspace-auto-map2.jpg)

至此，已经设置完毕，就是如此简单。

打开developer tool，在右侧的css面板中修改下相关的样式，再看看你的css文件，是不是也同步修改了？

Good Luck!

