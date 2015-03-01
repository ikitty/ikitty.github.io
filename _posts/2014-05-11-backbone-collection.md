---
layout: post
title: "Backbone.js学习记录-Collection"
description: "接着昨天Model的节奏，今天继续整理Collection部分。在前面，我们将model比喻为数据表中的一条记录，那么Collection就相当于一个数据表，是一个数据模型的集合，用于存储和管理一系列相同类型的模型对象。"
category: other
tags: []
---
{% include JB/setup %}

接着昨天Model的节奏，今天继续整理Collection部分。在前面，我们将model比喻为数据表中的一条记录，那么Collection就相当于一个数据表，是一个数据模型的集合，用于存储和管理一系列相同类型的模型对象。

###创建集合

首先，我们来创建一个集合：

    var Child = Backbone.Model.extend({
        defaults: function () {
            return {
                name: 'Jim'
                ,age: 10
            } ;
        }
    });

    //define collection
    var Children = Backbone.Collection.extend({
        model: Child
        ,localStorage: new Backbone.LocalStorage("bbChild")
    });

    // 创建一系列模型对象  
    var Jim = new Book({  
        name : 'Jim green'
    });  
    var Riven = new Book({  
        name : 'Riven Bonde'
    });  

    // 创建集合对象  
    var heros = new Children([Jim, Riven]);  
    // 查看集合中所有的model
    console.log(heros.models)


上面的代码中，我们为了创建两个model，将model类实例化了2次。实际上，我们可以使用clone方法来简单化：

    var Jim = new Book({  
        name : 'Jim green'
    });  
    var Riven = Jim.clone();
    Riven.set('name', 'Riven');
 
在实例化collection时，除了可以向构造函数中添加已经创建好的模型列表，还可以直接传递模型数据，集合会自动将这些数据转换为模型对象，如：
 
    // 直接定义要创建的数据数组 
    var models = [{  
        name : "Jim"
    }, {  
        name : "Riven"
    }];  
    // 创建集合对象  
    var heros = new Children(models);  

    // 或者更简单的方式,在实例化Backbone的原始collection时传入model参数
    // 当我们传递原始数据时，集合会自动根据model来创建对应的模型实例
    var heros_other = new Backbone.Collection(models, {
        model: Child  
    });
 
###给集合中添加模型

- add()：向集合中的指定位置插入模型，如果没有指定位置，默认追加到集合尾部
- push()：将模型追加到集合尾部（与add方法的实现相同）
- unshift()：将模型插入到集合头部
 
还是通过代码来熟悉一下：

    //创建collection的代码，和上面一样，这里就不多写
    heros.add({
        name: 'Vi'   
    });
    heros.push({
        name: 'Lucy'   
    });
    heros.unshift({
        name: 'Mike'   
    });
    heros.push({
        name: 'Lucy'   
    }, {
        at: 1   
    });

    _.each(heros.models, function (item, i) {
        console.log(item.get('name'));
    })

上面的代码结合console输出，已经是一目了然，不再多赘述了。当数据被成功添加到集合中时，集合会触发add事件。除非我们在调用add()方法时设置了silent配置项，则会忽略事件的触发。

###操作集合中的模型

Backbone将Underscore中的许多关于数组和对象的方法添加到的自己的原型中，我们在也可以使用underscore的方法来操作collection的数据，比如each()、map()、find()等方法。但有些方法是backbone进行了重写。所以这里分别说明下。

####删除模型：

下面这些方法都会删除模型对象,而且当模型被移除成功后，会触发集合对象的remove事件，除非你在移除时使用了silent配置。

- remove()：从集合中移除一个或多个指定的模型对象
- pop()：移除集合尾部的一个模型对象
- shift()：移除集合头部的一个模型对象
 
还是测试代码： 

    heros.remove(heros.models[1]);
    heros.pop();
    heros.shift();

    console.log('After remove data :');
    _.each(heros.models, function (item, i) {
        console.log(item.get('name'));
    })
  
 
###在集合中查找模型

- get()：根据模型的id或者cid查找模型对象
- at()：查找集合中指定位置的模型对象
- where()：根据数据对集合的模型进行筛选
 
测试代码：

    heros.add({name: 'Spada', id: 100});
    console.log(heros.get(100))
    console.log(heros.at(1))
    //find by filter
    console.log(heros.where({name: 'Vi'}))
 
当我们调用get()、at()方法没有找到到匹配对象时，会返回undefined，而where()方法在没有找到匹配对象时会返回一个空数组。你可以使用Underscore中的isEmpty()方法检查返回值是否为空，因为它能检查到空数组和空对象。

###排序

Backbone的集合对象中，为我们提供了集合元素的实时排序，当任何模型对象被插入到集合中时，都会按照预定的排序规则放到对应的位置。这需要用到comparator属性。

你可以指定comparator为某个属性（集合将根据这个属性的值排序）,也可以将其定义为一个排序函数，就像JS里面的sort一样。
 
    //test comparator
    var Girls = Backbone.Collection.extend({
        model: Child
        ,comparator: 'age'
    });
    var xgirl_models = [{
        name: 'dora'
        ,age:19
    },{
        name: 'winnie'
        ,age:18
    }];
    var xgirl = new Girls(xgirl_models);

    console.log('test comparator:');
    _.each(xgirl.models, function (item, i) {
        console.log(item.attributes);
    })
    
当我们设置了comparator方法后，所有关于元素位置的方法和参数都会失效，例如push()、unshift()方法和at参数等。
 
###从服务器获取集合数据
 
- fetch()：用于从服务器接口获取集合的初始化数据，覆盖或追加到集合列表中
- create()：在集合中创建一个新的模型，并将其同步到服务器
 
上代码：

    //fetch data from server for collection
    var Boys = Backbone.Collection.extend({
        model: Child
        ,url: 'http://localhost:8080/boy/'
    });
    var xboy = new Boys();
    // 要在回调中才能获取到值
    xboy.fetch({
        success: function(collection, resp) {  
            console.log('test fetch:');
            console.log(collection.models);  
        }  
    });
 
在调用fetch()方法同步集合数据时，默认会以覆盖的方式进行，这意味着集合在同步之前的数据将丢失。我们可以在调用fetch()方法时传递remove:false选项来通知集合进行添加，而不是覆盖，例如：

    xboy.fetch({
        remove: false
        ,success: function(collection, resp) {  
            console.log('test fetch:');
            console.log(collection.models);  
        }  
    });
 
数据在成功同步到集合中之后，会触发reset事件，我们可以通过监听该事件从而进行下一步操作（比如将集合中的数据显示到页面中）。集合的数据同步与模型的数据同步有许多相似之处（例如你可以重载parse()方法来对服务器返回的数据进行解析，使其能顺利被添加到集合中），这里就不再重复讨论。
 
###collection之create

集合提供的另一个create()方法，是根据集合的model所指向的模型类，创建一个模型对象，并把该对象添加到集合中，最后将数据同步到服务器接口。
 
    // 创建一个模型  
    xboy.create({  
        name : "Jake"
        ,age: 22
    }, {  
        success : function(model, resp) {  
            console.dir(xboy.models);  
        }  
    });  
     
集合对象默认会先将模型添加到集合中，再提交到服务器接口，无论接口返回是否成功，新建的模型对象都会被添加到集合中。我们可以通过传递wait配置，来控制只有在服务器返回成功之后（响应状态码为200），才将模型对象添加到集合中。

注意：在Backbone内部，create()方法是通过add()方法将新创建的模型添加到集合中的，因此我们一般通过监听add事件，来对新模型进行下一步操作。

###将数据批量同步到服务器

Backbone中集合提供了数据同步和创建的方法与服务器进行交互，但实际上这可能并不能满足我们的需求。例如：当我们需要对数据进行批量地添加、修改和删除操作时，就需要在Collection的基础上扩展自己的方法。

    //todo
    // 定义模型类  
    var Book = Backbone.Model.extend({  
        defaults : {  
            name : '',  
            price : 0  
        }  
    });  

    // 定义BookList类  
    var BookList = Backbone.Collection.extend({  
        model : Book,  
        url : '/service',  
        // 将集合中所有的模型id连接为一个字符串并返回  
        getIds : function() {  
            return _(this.models).map(function(model) {  
                return model.id;  
            }).join(',');  
        },  
        // 将集合中所有模型提交到服务器接口  
        createAll : function(options) {  
            return Backbone.sync.call(this, 'create', this, options);  
        },  
        // 修改集合中的所有模型数据  
        updateAll : function(options) {  
            return Backbone.sync.call(this, 'update', this, options);  
        },  
        // 删除集合中所有的模型  
        deleteAll : function(options) {  
            var result = Backbone.sync.call(this, 'delete', this, _.extend({  
                url : this.url + '/' + this.getIds()  
            }, options));  
            this.remove(this.models);  
            return result;  
        }  
    });  
    // 创建集合对象  
    var books = new BookList();  
    // 当集合触发reset事件时, 对数据进行批量同步  
    books.on('reset', function() {  
        books.createAll();  
        books.updateAll();  
        books.deleteAll();  
    });  
    // 从服务器接口同步默认数据 ,这会触发reset事件
    books.fetch();  
 
 
reset触发后，首先调用的是createAll()方法，它将把当前集合中的所有数据同步到服务器接口。

在createAll()方法中，我们调用Backbone.sync()方法发送异步请求，请注意sync()方法的第2个参数，它是一个模型或集合对象，当操作为create或update时，在sync()方法内部会调用该对象的toJSON()方法，并将toJSON()方法的返回值作为Request Payload请求数据发送到服务器接口。

updateAll()方法与createAll()方法几乎相同，它们的区别在于updateAll()方法在修改数据时传递给sync()方法的操作名为update而不是create，而发送给服务器的Request Method为PUT而不是POST。
 
最后deleteAll()方法与createAll()和updateAll()方法有些不同，因为deleteAll()方法发送给服务器的RequestMethod为DELETE方式，这种方式下不能直接调用toJSON()方法将数据发送给接口，因此我们需要手动组装和发送数据。于是,我们定义了getIds()方法用于将集合中的所有模型的id连接起来，并将之传递给服务器接口进行删除。
