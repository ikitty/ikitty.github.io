---
layout: post
title: "Backbone.js学习记录-model"
description: "借用backbone官方的一句话“Model是任何JS应用中最核心的部分”，包含了围绕该数据一些逻辑，比如：数据验证、转换、属性计算和访问控制。它是一个抽象的数据模型，相当于数据表中的一条数据。它的另外一个功能就是用于做持久化，即把数据存储到硬盘（文件、数据库形式）。在web端即对应存入localStorage等。当然，和服务器进行数据也是一个非常主要的功能。"
category: other
tags: []
---
{% include JB/setup %}

借用backbone官方的一句话“Model是任何JS应用中最核心的部分”，包含了围绕该数据一些逻辑，比如：数据验证、转换、属性计算和访问控制。它是一个抽象的数据模型，相当于数据表中的一条数据。它的另外一个功能就是用于做持久化，即把数据存储到硬盘（文件、数据库形式）。在web端即对应存入localStorage等。当然，和服务器进行数据也是一个非常主要的功能。

###创建Model

创建模型类的时候，可以覆盖已有的构造函数（一般时候我们不这么做）。通过给`defaults`属性赋值即可传入默认值，可以直接传入一个对象值，也可以传入一个返回对象的函数。由于对象是传址对象，所以建议尽量使用返回对象的函数。模型在实例化的时候自动调用initialize方法。

    var Child = Backbone.Model.extend({
        defaults: function () {
            return {
                name: 'Jim'
                ,age: 10
            } ;
        }
    });
    //实例化模型
    var Jack = new Child({
        name: 'jack'
        ,age: 12
        ,fun: '<b>吃饭</b>'
    });

###读取数据

通过数据模型的get方法读取数据，如果包含实体数据，可以使用escape来获取（escape会自动将转义内容，可以防止xss攻击），数据的attributes对象属性包含了所有的属性，不建议直接操作该属性，但可以在console中打印用以debug。

    //获取数据
    console.log(Jack.attributes) ;
    console.log(Jack.get('name')) ;

    //escape entities
    console.log(Jack.escape('fun')) ;
 
###写入数据

可以通过set方法来设置数据，设置数据时会触发change事件，通过监听change事件，我们可以对页面的UI进行及时的调整，change回调中传入的是修改后的数据。我们还可以对单个属性进行监听，当被监听的属性发生改变时，对应的属性事件(格式是change:attr)就会被触发。如果数据同时有事件监听和属性事件监听，属性事件总是先被触发。


    //修改数据
    Jack.set({
        //jack 长大了一岁
        age: 13
        //不再是个吃货了
        ,fun: 'football'
    })
    console.log(Jack.attributes) ;

    //事件监听
    Jack.on('change', function (model, value) {
        console.log('model has been changed, new value is :', value) ;
    });
    //还可以单独对某个属性进行监听,属性事件总是先被触发
    Jack.on('change:age', function (model, value) {
        console.log('model has been changed, new age is :', value) ;
    });

值得注意的是，bakcbone允许我们在修改数据模型时，获取上一次状态的数据，这就要用到previous 或 previousAttributes属性了。但一般情况下，我们**只能在监听事件的回调过程中能获取到数据的上一个状态**。(如果设置数据时附加了silent:true的选型，则又是另一种情况)

    Jack.on('change:age', function (model, value) {
        console.log('修改前的value是：', model.previous('age')) ;
        console.log('修改后的value是：', model.get('age')) ;
    });
    Jack.set({ age: 15 });

###删除数据

- unset用于删除单个属性
- clear用于删除数据的所有属性
- destroy方法用于将数据从集合和服务器中删除，需要注意的是，该方法并不会清除模型本身的数据。

    //删除数据
    Jack.unset('age');
    console.log('unset age', Jack.attributes) ;
    Jack.clear();
    console.log('clear all attr', Jack.attributes) ;
    
###数据验证

根据项目需求来定义validate方法和返回值，validate的验证规则是：如果验证通过则返回undefined；如果不通过，则返回自定义错误，并触发invalid事件(可以简单理解为：只要不返回undefined,就触发invalid)。可以预先监听模型的invalid事件来捕获这些错误，并反馈到UI层。

值得注意的是：设置数据时默认是不会触发validate，触发有弃用验证选型。而在数据发生变化（比如save）时会自动触发validate。

    var Book = Backbone.Model.extend({
        validate: function (data) {
            if (data.price < 1) {
                return 'price is unavailable' ;
            }
        }
    });
    var jsBook = new Book( {price: 5});
    jsBook.on('invalid', function (model, error) {
        console.log('model data invalid .', error) ;
    })
    //set时需要手动指定validate参数才行
    //jsBook.set({price: 0.5}, {validate:true});

    //save自动触发validate
    jsBook.save({price: 0.5});

###数据同步和url规则

Backbone提供了与服务器数据的无缝连接，我们只需要操作本地Model对象，Backbone就会按照规则自动将数据同步到服务器。如果使用默认的同步特性，请保证服务器数据接口支持rest架构。在rest架构中，数据的CRUD直接通过请求头中的request method来传达。

每个模型对象都有一个数据标识——id（可以通过idAttribute来修改），来与服务器的交互中，模型会自动在url后加上id。（新建时不会加。可以通过isNew来判断）

- url，固定地址，我们无需让Backbone自动连接模型id（这可能是在url本身已经设置了模型id，或者不需要传递模型id）
- urlRoot，表示服务器接口地址的根目录，我们无法直接访问它，只能通过连接模型id来组成一个最终的接口地址（在删除数据时需要使用urlRoot，因为需要backbone将model的id追加的url中）


先创建一个英雄，接下来逐步来介绍数据的CRUD。

    var Girl = Backbone.Model.extend({
        urlRoot: 'http://localhost:8080/hero/'
    });
    var katarina = new Girl({
        name: 'kata'
        ,age: 18
    });
    
####create

    //create
    katarina.save(null, function(){
        console.log('saved success');
    });

如果数据没有id属性(模型内部会通过isNew来检测)，则表示是新增——creat，对应的request method是POST。可以在浏览器network面板中看到request header。同时对象的属性也会通过request payload传输到服务端。

如果服务器的respond body中没有任何数据，你会发现保存之后的模型较之前没有发生任何变化，在你下一次调用save()方法的时候，它仍然会以POST方式通知服务器创建一条新的数据。这是因为模型对象并没有获取到刚刚服务器创建成功的记录id，因此我们希望服务器接口在将数据保存成功之后，同时将新的id返回给我们，如：

    {  
        "id" : "1001",  
        "name" : "kata",  
        "age" : "18"  
    }  
    
这一段是服务器接口返回的数据，它除了返回新记录的id，（当然，你也可以只返回新记录的id，我们常常都是这样做的）。这时我们再来看现在模型中的数据，它多了一个id属性，也就是说模型使用服务器返回的最新数据替换了之前的数据。

在配置项中，还可以包含一个wait配置，如果我们wait配置为true，那么数据会在被提交到服务器之前进行验证，当服务器没有响应新数据（或响应失败）时，模型中的数据会被还原为修改前的状态。如果没有传递wait配置，那么无论服务器是否保存成功，模型数据均会被修改为最新的状态、或服务器返回的数据。接上面的代码调整：

    katarina.save({  
        name : 'kata'
        ,age : 20
    }, {  
        wait : true  
    });  
    console.log(katarina.attributes);
    
此时，将服务端返回的数据设置为空。你能看到在save()调用完成之后，模型中的数据被恢复成最初定义的数据，因为我们在调用save()方法时传递了wait配置。（你也可以试着将wait配置去掉，然后再运行它，你会发现虽然服务器接口并没有返回数据或保存成功，但模型对象中仍然保持着最新的数据）

上面提到服务器接口返回的数据会被覆盖到当前模型中，在刚刚的例子里，接口返回的数据就是模型需要的数据。而实际开发中往往并没有这么顺利，我们接口返回的数据可能不是我们期待的json格式。这样一来，我们就需要自定义parse方法来解析返回的数据

    var katarina = Backbone.Model.extend({  
        urlRoot : 'server',  
        // 重载parse方法解析服务器返回的数据  
        parse : function(resp, xhr) {  
            var data = resp.data[0];  
            return {  
                id : data.id,  
                age : data.age  
            }  
        }  
    });  

另外，建议success回调函数中只要做一些与业务逻辑和数据无关的、单纯的界面展现即可，如果数据保存成功之后涉及到业务逻辑或数据显示，你应该通过监听模型的change事件，并在监听函数中实现它们。虽然Backbone并没有这样的要求和约束，但这样更有利于组织你的代码。

####update

    //update 
    katarina.save({id:123});
    //backbone会追加id到url中，所以对应的请求URL是 http://localhost:8080/hero/123
    
数据中带有id（可通过isNew来检测是否是新数据），表示是update数据，对应的request method是PUT.

####read

    //read 
    katarina.fetch({id:123});

fetch表示从服务端获取数据，此时，对应的request method就是GET
    
####delete

    //delete
    katarina.set({id:111});
    katarina.destroy({});

destroy表示从服务端删除数据，此时，对应的request method是DELETE

在调用destroy()方法时我们同样可以传递一个配置对象，它除了success和error回调函数外，也能像save()方法一样包含一个wait配置，来看下面的例子：

    katarina.on('destroy', function(){
        console.log('be destroied') ;
    })
    katarina.destroy({wait: true});

如果服务器没有正确的返回，那么destroy事件是不会触发的。

###一句话小结

上面啰啰嗦嗦的说了关于数据的创建，读取，验证，同步，以及其中的一些细节。接下来继续攻略collection。
