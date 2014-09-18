---
layout: post
title: "http protocol detail"
description: "协议是指计算机通信网络中两台计算机之间进行通信所必须共同遵守的规定或规则，超文本传输协议(HTTP)是一种基于TCP/IP的通信协议，它允许将各种资源从Web服务器传送到客户端的浏览器."
category: Frontend
tags: [http, http_status]
---
{% include JB/setup %}

计算机中的协议是指通信网络中两台机器之间进行通信所必须共同遵守的规则，超文本传输协议(HTTP)是一种基于TCP/IP的通信协议，它允许将各种资源从Web服务器传送到客户端的浏览器.

当我们打开浏览器输入URL后，浏览器给对于的web服务器发送一个request，web服务器针对request处理并返回response给浏览器解析，于是就有了我们看到页面。(看着很简单，其实即使是发一个request都是分为多个小过程实现：DNSlookup - connect - send - wait - received。而前端开发只有充分了解这些才能将性能优化做得更好，比如使用dns-prefetch省去DNSlookup的时间等。)

###历史

- 0.9 get supported only
- 1.0 support post method ,支持长连接（但默认还是使用短连接）
- 1.1 rich header ， 默认长连接

###Request and Response Message

原始的Request Message可以通过Fillder或者httpwatch插件来查看，chrome等浏览器也能很方便的network pannel中查看格式化后的相关请求信息。它分为请求行、http header和body三部分(header和body之间以空行分隔).

    //在http1.1中，method共有八种：options，head，get，post，put等等。
    method path httpVersion
    header1: value1
    header2: value2

    request body

Response message的结构和request mesaage类似，区别在于response message的第一行包含的分布是：httpVersion、状态码和状态信息. http header的内容稍微多一点，在后面会详细说明。

get和post是我们最常用到的两种请求方式，这里顺便列举了他们的区别：

- get提交的数据放在URL后面以`？`分割。http协议对get请求的参数并没有限制，但浏览器有有对URL长度进行限制。IE中ur的最大长度是2083字节（2k+35），Firefox是65535字节，safari是80000字符,Opera为190,000个字符,ChromeURL为8182个字符。Apache (Server)能接受最大url长度为8,192个字符。
- post提交的数据是在请求头的body中，http没有对长度做限制，但服务器端会设置处理数据的长度上限。
- 在服务端，get提交的数据需要用Request.querystring获取，而post提交的数据是通过Request.form来获取
- get条件会将敏感信息暴露在URL中从而引发安全隐患

###http状态码

HTTP/1.1中定义了5类状态码，状态码由三位数字组成，第一个数字定义了响应的类别:

- 1XX  提示 - 表示请求已被成功接收，继续处理
- 2XX  成功 - 表示请求已被成功接收
- 3XX  重定向 - 要完成请求必须进行更进一步的处理
- 4XX  客户端错误 -  请求有语法错误或请求无法实现
- 5XX  服务器端错误 -  服务器未能实现合法的请求

这里解释几个常见的：

- 200 success 不解释
- 302 redirect，在response中的location返回新的url，浏览器对新的url再发起request
- 304 not modified,该资源自从上次访问还没有被修改（如果客户端发送了一个带条件的GET请求且该请求已被允许，而文档的内容（自上次访问以来或者根据请求的条件）并没有改变，则服务器应当返回这个状态码。304响应禁止包含消息体，因此始终以消息头后的第一个空行结尾。）
- 400 错误的语法
- 403 禁止访问
- 404 资源不存在
- 500 服务端error

[查看全部状态码介绍]('http://zh.wikipedia.org/wiki/HTTP%E7%8A%B6%E6%80%81%E7%A0%81#1xx.E6.B6.88.E6.81.AF')


接下来会详细介绍一些http header里面的字段内容(结合Fiddler实际操作会有更深的印象)。

###Request headers

####Cache

a. If-Modified-Since

把浏览器端cache的最后修改时间发送到服务端，服务器会把这个时间和实际文件的最后修改时间进行对比，如果时间一致，返回304，客户端直接读取cache，否则就会返回200和新文件内容。客户端接收丢失旧文件，缓存新文件。

b. if-None-Match

If-None-Match和ETag一起工作，工作原理是在HTTP Response中添加ETag信息。 当用户再次请求该资源时，将在HTTP Request 中加入If-None-Match信息(ETag的值)。如果服务器验证资源的ETag没有改变（该资源没有更新），将返回一个304状态告诉客户端使用本地缓存文件。否则将返回200状态和新的资源和Etag

c. Pragma

在HTTP/1.1版本中，它和Cache-Control:no-cache作用一模一样. Pargma只有一个用法：`Pragma: no-cache`


d. Cache-Control

http1.1引入。这个用来指定Response-Request遵循的缓存机制。各个指令含义如下:

- Cache-Control:Public      可以被任何缓存所缓存
- Cache-Control:Private     内容只缓存到私有缓存中
- Cache-Control:no-cache    所有内容都不会被缓存

####Client

a. Accept

浏览器端可以接受的媒体类型,例如：Accept: text/html  代表浏览器可以接受服务器回发的类型为 text/html  也就是我们常说的html文档. 一般浏览器都是发`*`,即可以请求所有类型数据.

b. Accept-Encoding：

浏览器申明自己接收的编码方法，通常指定压缩方法，是否支持压缩，支持什么压缩方法（gzip，deflate）, 如：Accept-Encoding: gzip, deflate

c. Accept-Charset

浏览器申明自己接收的字符集，如gb2312，utf-8

d. Accept-Language

浏览器申明自己接收的语言。例如： Accept-Language: en-us

e. User-Agent

告诉HTTP服务器， 客户端使用的操作系统和浏览器的名称和版本.

####Cookie/Login

Cookie, 最重要的header, 将cookie的值发送给HTTP 服务器

####Entity

a. Content-Length. 发送给HTTP服务器数据的长度。利用contentLength的限制来发动拒绝服务攻击。在传送完成前，内存不会释放，利用该缺陷连续向服务器发送垃圾数据导致web服务器内存耗尽

b. Content-Type 

####Miscellaneous

Referer, 指定文档来源

####Transport 头域

a. Connection

Connection: keep-alive 当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接

Connection: close  代表一个Request完成后，客户端和服务器之间用于传输HTTP数据的TCP连接会关闭， 当客户端再次发送Request，需要重新建立TCP连接。

b. Host（发送请求时，该报头域是必需的）

请求报头域主要用于指定被请求资源的Internet主机和端口号，它通常从HTTP URL中提取出来的

###Response headers


####Cache

a. Date 生成消息的具体时间和日期,例如：Date: Sat, 11 Feb 2012 11:35:14 GMT

b. Expires 缓期过期时间

####cookie/Login

a. P3P 用于跨域设置Cookie, 这样可以解决iframe跨域访问cookie的问题, 例如: P3P: CP=CURa ADMa DEVa PSAo PSDo OUR BUS UNI PUR INT DEM STA PRE COM NAV OTC NOI DSP COR

b. Set-Cookie 把cookie发送到客户端浏览器，每一个写入cookie都会生成一个Set-Cookie.例如: Set-Cookie: sc=4c31523a; path=/; domain=.acookie.x.com

####Entity

a. ETag 配合if-None-Match使用

b. Last-Modified 用法见上面的If-modified-Since

c. Content-Type, Content-Length

d. Content-Encoding, Content-Language 参考request header

####Miscellaneous

a. Server 指明HTTP服务器的软件信息

b. x-Powered-By: 表示网站是用什么技术开发的

####Transport

a. Connection 参考request header

####Location

a.Location 用于重定向一个新的位置， 包含新的URL地址,参考304状态码

###http协议的无状态

无状态是指协议对于事务处理没有记忆能力，服务器不知道客户端是什么状态。从另一方面讲，打开一个服务器上的网页和你之前打开这个服务器上的网页之间没有任何联系。

HTTP是一个无状态的面向连接的协议，无状态不代表HTTP不能保持TCP连接，更不能代表HTTP使用的是UDP协议（无连接）。

从HTTP/1.1起，默认都开启了Keep-Alive，保持连接特性，简单地说，当一个网页打开完成后，客户端和服务器之间用于传输HTTP数据的TCP连接不会关闭，如果客户端再次访问这个服务器上的网页，会继续使用这一条已经建立的连接。当然，Keep-Alive也不会永久保持连接，它有一个保持时间，可以在不同的服务器软件（如Apache）中设定这个时间。

###SPDY

SPDY是google开发的基于tcp/ip的传输协议,全称是speedy,目前还处于草案阶段，但他自家的chrome已经支持了。

- 本质只是修改http的request和response的传输方式
- 一个请求可供多个资源传输,基于tls加密
- 除了浏览器主动请求内容，还可以主动推送内容
