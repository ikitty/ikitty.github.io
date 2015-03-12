---
layout: post
title: "Backbone.js实践-踩坑和解决方法"
description: "前面几天持续学习了bakcbone.js的基本概念和搭建一个简单App的大致流程，这不，马上就来动手实践了。搭建一个简单的应用雏形是非常容易的，但稍微增加了一些功能，就会频繁卡壳，特别是和后端数据交互的时候，知易行难，代码这东西，总是要在不断的实践中才能有更好的体会。我就把搭建应用的过程遇到的一些问题记录下。"
category: other
tags: []
---
{% include JB/setup %}

前面几天持续学习了bakcbone.js的基本概念和搭建一个简单App的大致流程，这不，马上就来动手实践了。搭建一个简单的应用雏形是非常容易的，但稍微增加了一些功能，就会频繁卡壳，特别是和后端数据交互的时候，知易行难，代码这东西，总是要在不断的实践中才能有更好的体会。我就把搭建应用的过程遇到的一些问题记录下。

###初始化项目

有自动化构建工具可以帮你搞定项目初始化的事情，当然手动搭建也不麻烦，新建应用目录结构，引入依赖文件等。整个应用的目录结构：

    |_code.py
    |_init_sqlite.py
    |_mod_sqlite.py
    |_showdata.py
    |_static
    | |_app
    | | |_css
    | | |_js
    | | | |_app.js
    | | | |_collections
    | | | | |_items.js
    | | | |_models
    | | | | |_item.js
    | | | |_views
    | | | | |_item.js
    | | | | |_itemForm.js
    | | | | |_items.js
    | |_vendor
    | | |_backbone
    | | |_bootstrap
    | | |_jquery
    | | |_underscore
    |_templates
    | |_index.html

###大致流程

- 规划好应用的url，并为每个url指定对应的action。
- 为app设置一个对象名称，比如图书管理应用，我们可以命名为BookManage，然后将所有的MVC对象都放入其中，便于管理
- 初始化模型数据（设定好必要属性字段）
- 初始化Collection和必要的处理方法
- 为各个界面初始化View，并创建对应的render事件。在View层有两件事情要做：一是处理UI界面的事件代理；二是监听数据变化来自动更新UI

###本地存储和服务端存储的操作差别

首先，在本地存储要引入backbone的localStorage组件，并在Collection中设置好localStorage属性,在服务端存储，要为Collection设置对应的服务端的url，并保证服务端支持RESTful的数据交互方式。

下面分别说明了两种方式的操作差别：

####本地存储

    create  Collection.add()
    read    new Views(Collection)
    update  Model.set(newAttr)
    delete  model.collection.remove(this.model)

####服务端存储

建议在每部操作加上wait:true参数保证数据真正的同步到服务端，服务端返回的也必须是严格的Model格式的json数据，否则会进入error回调分支。(一开始由于对web.py不太熟悉，所以在这里卡了很久，命名返回的是200，却总是进入error分支)

    create  Collection.create()
    read    Collection.fetch()
    update  Model.save()
    delete  Model.destory()

在View层，对数据监听的事件也会有所调整，比如fetch后，Collection会触发add事件，这时候，我们要监听add事件来更新UI。

###URLS

简单情况下，我们不要为Model设置url或者urlRoot，官方有申明，Model会自动根据其所属的Collection的url来构造。当然，如果要指定特殊的url，也可以在请求数据交互的时候额外指定url或者urlRoot. 源码：

    function() {
          var base = _.result(this, 'urlRoot') || _.result(this.collection, 'url') || urlError();
          if (this.isNew()) return base;
          return base + (base.charAt(base.length - 1) === '/' ? '' : '/') + encodeURIComponent(this.id);
    }

有三种方式构造model的url：

- 如果model属于collection中，那么他的url可以用collection的url和model.id来构造（collection.ur/[id]）
- 如果你想单独使用model，那么直接设置model.urlRoot 
- 最后，如果你想单独给model指定url，那就设置model.url


###其他

- 因为对webpy不熟悉，比如db的返回值类型，  json.dumps, json.load的格式问题
- 不清楚backbone的request应该对应哪种response，所在在调试的时候，http 返回的是200，但总是进入error分支
- 在更新UI的时候总会遇到莫名其妙的错误，比如某个变量无法取值，backbone和服务端通讯是异步的，所以要记得监听collection的事件绑定才能正确的更新UI

