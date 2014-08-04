---
layout: post
title: "mac系统中使用goagent科学上网"
description: "为什么要科学上网，我需要上Google查询相关资料；需要通过twitter了解业界的动态；需要使用facebook联络朋友；需要linkedi整理人脉；偶尔也可用区youtube看看video...太多理由了。今天花点时间弄了下使用goagent科学上网，特此记录遇到的坑。"
category: 
tags: []
---
{% include JB/setup %}

为什么要科学上网，我需要上Google查询相关资料；需要通过twitter了解业界的动态；需要使用facebook联络朋友；需要linkedi整理人脉；偶尔也可用区youtube看看video...太多理由了。今天花点时间弄了下使用goagent科学上网，所以记录下。

###什么是goagent

goagent is a google app engine(GAE) proxy.

###创建application

去https://appengine.google.com/创建一个app，步骤很简单。看不懂的选项就选择默认。

问题来了，google被墙了，GAE当然也不能访问了。还好有雷锋提供了相关的hosts可用用。贴个最近可用的：

    74.125.229.174 appengine.google.com

如何配置hosts这种步骤我就不赘述了。后面的步骤也要依赖于配置正确的host，否则是无法进行下去的。

###下载并配置goagent客户端

goagent客户端可用用这个：http://pan.baidu.com/share/link?shareid=1462706879&uk=4028060069 .下载安装后，进入其包内容目录。修改info.plist中的GoAgentPath值为：`/Applications/goagent/local/proxy.py` (在后面的步骤中会把相关文件放到这里的)

###下载并配置goagent文件夹

goagent文件夹地址：https://code.google.com/p/goagent/ , 下载后将goagent文件夹放入applications目录里面。打开local目录下的proxy.ini文件，修改appid为你刚创建的application名称。

接下来要上传应用了，在terminal中进入到目录： `/Applications/goagent/server `, 运行`python uploader.zip`。

坑要出现了，白天在公司时，公司的网络是启用了代理的，所以上面的命令在rolling back the update的时候就报错了。当时查了半天.所以最好在不需要代理的环境中上传。

OK,继续正常模式，正常情况，会提示你两次输入google帐号和密码的，然后就等文件上传了。上传完后，科学上网就完成90%了。

在terminal中切换到goagent的local目录中，运行`python proxy.py`,科学上网时要一致保持它运行着。

###浏览器配置

webkit内核的浏览器可用下载switchSharp这个扩展。然后导入这个配置http://goagent.googlecode.com/files/SwitchyOptions.bak,选择GoAgent规则。

好了，试试打开twitter.com吧

可结果并不是so的一下进入那熟悉界面。而是一个关于证书的提示。。。WTF。well，最后一步了

###导入证书

- chrome 设置 -》高级设置-》https/ssl（管理证书）-》导入-》受信任的根证书颁发机构-》然后选择 goagent\local\CA.crt”
- 打开钥匙串 - 搜索GoAgent,  并双击每个装束，点击信任，启用SSL的总是信任。

世界正常了。

