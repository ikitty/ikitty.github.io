---
layout: post
title: "Backbone.js学习记录-Router"
description: "Backbone的Router提供路由控制，它一般运行在单页应用中，将特定的URL绑定到一个对应的方法（Action）。"
category: other
tags: []
---
{% include JB/setup %}

Backbone的Router提供路由控制，它一般运行在单页应用中，将特定的URL绑定到一个对应的方法（Action）。

###遇到的问题

- 用户在SPA中看到好的文章想分享时，他会将当前URL收藏或者转发给好友，但是当他下次打开页面时，页面又回到了初始状态。
- 用户在同一个页面中通过操作来隐藏、显示HTML块，但他们可能并不知道他当前正处于同一个页面中，因此他希望通过浏览器的“前进”和“后退”按钮来返回和前进到上一步操作。当他真正这样操作时，会离开当前页面，这显然不是用户所期望的。

Backbone.Router为我们提供了解决这两个问题的方法，Look:
 
    //=-======router
    var AppRouter = Backbone.Router.extend({  
        routes : {  
            '' : 'main',  
            'list' : 'list',  
            'list/:id' : 'detail',  
            '*other' : 'other'  
        },  
        main : function() {  
            console.log('welcome') ;
        },  
        list: function () {
            console.log('welcome to list page') ;
        },
        detail: function (id) {
            console.log('welcome to detail page', id) ;
        },
        other: function (other) {
            console.log('welcome to other page', other) ;
        }
    });  
      
    var router = new AppRouter();  
    Backbone.history.start();  

 
我们来依次访问下面的网址(假设文件名为test.html)，并留意console的输出信息：
 
- http://localhost/test.html 
- http://localhost/test.html#list
- http://localhost/test.html#list/3
- http://localhost/test.html#xxx
 
然后再使用浏览器的“前进”、“返回”等按钮进行切换，你会看到当你的URL切换时，控制台输出了对应的结果，说明它已经调用了相应的方法。而在进行这些操时，页面并没有刷新。这样便解决了一开始提到的两个场景问题。

###路由规则

“路由器”，它常常是指一种网络设备，这种设备是网络连接、数据传输的导航和枢纽。而Backbone中的router功能与它类似，它可以将不同的URL锚点导航到对应的Action方法。Backbone的router是由Backbone.Router和Backbone.History两个类共同完成的：

- Router类用于定义和解析路由规则，并将URL映射到Action。
- History类用于监听URL的变化，和触发Action方法。

一般不会直接实例化一个History，因为我们在第一次创建Router实例时，会自动创建一个History的单例对象，你可以通过Backbone.history来访问这个对象。

####Hash规则

URL规则表示当前URL中的Hash（锚点）片段，我们除了能在规则中指定一般的字符串外，还支持正则匹配：

- 规则中以`/`为分隔的一段字符串，在Router类内部会被转换为([^\/]+)，表示以/（斜线）开头的多个字符
- `:arguments`表示arguments将作为参数传入给action，这里的arguments相当于形参，比如：`list/:id`可以匹配`list/111`这样，并且111会被传递给对于的action
- `*xxx`会在Router内部被转换为`(.*?)`，与`:`规则相比，`*`没有/（斜线）分隔的限制，它也会将匹配到的数据传递给action

这些规则都会对应一个Action方法名称，**该方法必须处于Router对象中**。

在定义好Router类之后，我们需要实例化一个Router对象，并调用Backbone.history对象的start()方法，该方法会启动对URL的监听。在History对象内部，默认会通过onhashchange事件监听URL中Hash（锚点）的变化，对于不支持onhashchange事件的浏览器（例如IE6），History会通过setInterval的方式监听。

####pushState规则

Backbone.History还支持pushState方式的URL，pushState是HTML5提供的一种新特性，它能操作当前浏览器的URL（而不是仅仅改变锚点），同时不会导致页面刷新，从而使单页应用使用起来更像一套完整的流程。
 
- pushState()：该方法可以将指定的URL添加一个新的history实体到浏览器历史里
- replaceState()：该方法可以将当前的history实体替换为指定的URL
 
调用pushState()和replaceState()方法，仅仅是替换当前页面的URL，而并不会真正转到这个URL地址（当使用后退或前进按钮时，也不会跳转到该URL），我们可以通过onpopstate事件来监听这两个方法引起的URL变化。

###路由相关

在设定好路由规则之后，如果需要动态调整，可以调用Router.route()方法来动态添加路由规则及Action方法，例如：
 
    router.route('list/:order/:pagesize', 'page', function(order, pagesize){  
        // todo  
    });  
 
route()方法的规则也支持正则，如：

    router.route(/^list/(.*?)/(.*?)$/, 'page', function(x, y){  
        // todo  
    });  
 
navigate()方法，能让我们可以手动进行跳转、导航，这时可以调用Router.navigate()方法进行控制，例如：
 
    router.navigate('list/1000', {  
        trigger: true  
    });  
 
需要注意的是，我们在第二个参数传入了trigger配置，该配置用于表示更改URL的同时是否触发相应的Action方法。

stop()方法让浏览器停止监听URL，运行下面的方法后，再访问相关URL，action已经不再触发了。
 
    Backbone.history.stop();  

