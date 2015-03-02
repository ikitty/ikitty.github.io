---
layout: post
title: "Backbone.js学习记录-View"
description:
category: other
tags: []
---
{% include JB/setup %}

Backbone的View层负责将数据渲染到界面，并管理view层的交互事件和逻辑。View提供了一组处理DOM事件、和渲染模型（或集合）数据的方法。下面结合代码来更好的理解。

###创建视图

在定义ListView时，我们设置了el属性，它是DOM选择器(jquery格式)，但视图对象在实例化时，会在内部通过这个选择器获取对应的DOM对象，并重新存放在el属性中。因此我们可以在视图的内部通过this.el来访问所关联的DOM对象。每个视图对象都会关联一个DOM 对象，视图中所有操作都限定在这个DOM对象之内，这样做可以便于视图界面的控制（如渲染、隐藏和移除等），同时能提高查找视图内子元素的效率。

当然，如果内容是动态生成的，我们可以不设置el，而是设置其他的属性来生成DOM，比如tagName(如果不设置，就会create一个div作为默认容器)，id，className

    //test create view
    var ListView = Backbone.View.extend({  
        // el: $('div.test'),
        tagName : 'section',  
        className : 'sec',  
        id : 'list',  
        attributes : {  
            style : 'color:red'  
        },  
        initialize: function () {
            console.log('created a test view') ;  
            // this.render();
        },
        render : function() {  
            this.el.innerHTML = 'Hi World!';  
            document.body.appendChild(this.el);  
        }  
    });  
    var listview = new ListView();  
    listview.render();  
 
同backbone其他类型一样，view实例化时也会调用initialize方法，所以，我们可以将render方法放在initialize里面去自动执行，也可以根据情况，在实例化之后手动执行。 

###处理DOM事件

视图很重要的一个特性是帮助我们自动绑定界面事件。之前，我们绑定事件可能是先获取到DOM对象，然后监听相关事件，并传入对于的callback，如：
 
    <p>  
        <span id="x">click me</span>
    </p>  
    <script type="text/javascript">  
        function testFn() {  
            // todo  
        }  
        $('#x').on('click', testFn);  
    </script>  

Backbone的视图对象为我们提供了事件的自动绑定机制，使其结构更加清晰，便于更好地维护DOM和事件间的关系，Look：
 
    <p id="view">  
        <span id="x">click me</span>
        <span id="y">click me</span>
    </p>  
    <script>  
        var xView = Backbone.View.extend({  
            el : '#view',  
            events : {  
                'click #x' : 'fnX',  
                'click #y' : 'fnY',  
            },  
            fnX: function(){
                //do sth   
            },
            fnY: function(){
                //do sth   
            },
        });  
        var view = new xView();  
    </script>  
 
backbone视图的events属性用来管理事件列表，其格式是：`eventName selector: eventCallback`，由于backbone依赖jquery，所以，选择器是任何jq支持的选择器字符串，事件处理函数就是自己在视图中定义的方法名。这些操作都会在视图类被实例化时自动完成，我们可以更关心视图类本身的结构，而不是刻意地去考虑如何绑定事件。

值得注意的是：backbone的view使用了事件代理机制(delegate)，所以无需担心DOM调整是否会影响事件绑定。如果有特殊情况需要手动处理，视图对象提供了delegateEvents()和undelegateEvents()方法用于动态绑定和解除events事件列表。

