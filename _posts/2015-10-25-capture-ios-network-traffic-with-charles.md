---
layout: post
title: "使用Charles抓取iOS Apps请求"
description: "进行移动端开发的时候，经常要对App的请求进行抓包调试，在win下面有Fiddler可以便捷的完成抓包。在Mac下，可以利用Charles来实现。Charles是收费软件，但也有免费试用版本，只是在体验上会打个折扣。如果是长期在Mac下开发，推荐团购入手。"
tags: [Charles]
category: mac
---
{% include JB/setup %}

进行移动端开发的时候，经常要对App的请求进行抓包调试，在win下面有Fiddler可以便捷的完成抓包。在Mac下，可以利用Charles来实现。Charles是收费软件，但也有免费试用版本，只是在体验上会打个折扣。如果是长期在Mac下开发，推荐团购入手。

###前提

无论是fiddler还是charles捕获手机端流量，都需要让PC和移动设备处于同一个局域网。如果在公司用台式机办公的话，可以考虑自己买个无限网卡插在PC上，然后让PC和手机连接同一个无限网络。

###将Charles设置为系统代理

下载、安装好charles后，启动Charles。由于Charles是将自己设置为代理服务器来完成流量捕获的。所以，我们要将Charles设置为系统代理。选择菜单中的Proxy- Mac OSX Proxy。

此时，打开浏览器，随便打开一个网站，就可以在Charles界面中看到请求数。Structure和Sequence是按域名和时序排列的两种展示方式。提醒：如果你用了翻墙之类的插件，记得将浏览器的插件的代理修改为系统代理，否则Charles是无法捕获。

###过滤网络请求

临时性过滤，可以直接在节目中点击放大镜按钮，然后输入关键字即可。对于长期性的过滤，可以在recording setting中设置include 规则，比如我们要查看手机的App是否是由XCodeGhost的软件开发的，就可以在inlucde栏目的设置填入：`host: *.icloud-analysis.com` (支持通配符，很便利) ，如果捕获到对该域名的请求，就会显示在界面中。

###捕获手机请求

重点来了。我们先打开Charles的代理功能，在菜单中选择proxy-proxy setting，在第一个proxies中，填入端口`8888`，勾选`Enabled transparent http proxies`。

手机的设置，首先在终端通过`ifconfig en0`查看Mac的IP地址，然后在iPhone的无线网络的设置中，点击当前连接的wifi的详情按钮，滑倒最底部，找到http代理，点击手动，然后输入Mac电脑的IP地址和前面填入端口`8888`。设置好之后，我们打开任意iPhone应用，在Charles中就能看到弹出一个iPhone请求通过Charles来访问网络的请求对话框，点击`Allow`即可。然后我们就可以愉快的进行移动端的抓包了。

###解析SSL

很多协议是SSL加密，如果我们需要调试这些请求，就要安装charles的安全证书，也很方便。在Mac上访问[http://www.charlesproxy.com/getssl](http://www.charlesproxy.com/getssl)，下载并安装好证书。重启Charles，然后在想要捕获的请求中，右击，选择`Enable SSl proxying`。这样就可以解析SSL请求了。


当然，Charles还有其他的调试功能，比如模拟慢网速，修改请求内容等。这里就不一一详细描述了。
