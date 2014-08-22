###js

###基本特点

####解释性语言(interpreted language)

编译型语言必须先通过编译才能执行, JavaScript是一种解释性语言，而解释性语言不需要编译，直接从上到下解释执行，一边解释一边执行，这就决定了解释性语言的代码是有先后顺序的，需要执行的代码必须已经解释过。因此，JavaScript需要注意代码的先后顺序。

####动态语言

动态类型语言：动态类型语言是指在运行期间才去做数据类型检查的语言，也就是说，在用动态类型的语言编程时，**永远也不用给任何变量指定数据类型**，我可以先给某个变量赋值一个number，如果有需要，我又可以直接将这个变量的值赋值为string。Python和Ruby就是一种典型的动态类型语言。静态类型语言：它的数据类型是在编译其间检查的，也就是说在写程序时要声明所有变量的数据类型，C/C++, OC是静态类型语言的典型代表，其他的静态类型语言还有C#、JAVA等，变量身边总是会跟着一个类型标识（像个保镖似的）。

    //JS code snippet
    var str ='a string'
    //but we can convert str to number directly
    //虽然我们可以这么干，但我们真不建议这么干
    str = 123

    //我们建议使用后缀来表示变量的类型, Arr后缀表示这个变量是这个变量是Array类型
    var nameArr = ['Jim', 'Kate'];
    var nameStr = nameStr.join('-');

    //python snippet
    var_foo = [1,23,33]
    //convert var_foo to string , that's ok
    var_foo = 'string'

####弱类型

强类型定义，比如若一个变量a被赋值为数字，那么程序无法将a当作字符串去处理(除非我通过代码将a转换为字符串方式)。程序不会处理不是规定类型的变量(我只接受str类型变量，你要传入int类型的，我就生气报错了)。弱类型定义，数字变量也可以当作字符串处理，如：

    //python是强类型的动态语言
    //in python
    list = [1,2,3]
    print ''.join(list) //报错，join是string的方法，它所需要的参数必须要是string类型的

    //JS是弱类型动态语言
    alert(1 + 'zbc') // Js解释器会自动做类型转换

####动态添加属性和方法

我们可以动态为某个对象添加以前没有的属性和方法。这个特点使JavaScript非常灵活，正因为有了这个特点，JavaScript的面向对象编程才有了可能。

####prototype

prototype属性返回对象的所有属性和方法，所有 JavaScript 内部对象都有只读的 prototype 属性，可以向其原型中动态添加属性和方法，但该对象不能被赋予不同的原型。但是自定义的对象可以被赋给新的原型。


###面向对象编程

面向对象有下列三个主要特点：封装、继承和多态。这里先详细说明这几个特点，后面几个部分分别在JavaScript中实现这些特点，从而实现完整的面向对象模拟。

- 封装：封装就是把各种方法和变量合并到一个类，用这个类代表某个对象为完成一定的任务所能保存的范围以及它能执行的操作。封装隐藏了方法执行的细节。
- 继承：继承就是根据现有类的方法和成员变量生成新的类的功能。
- 多态：多态就是对象随着程序执行而使其形式发生改变的能力。在python中，多态被这样描述：This is called **polymorphism** where a sub-type can be substituted in any situation where a parent type is expected i.e. the object can be treated as an instance of the parent class. wikipedia中将多态分为了三类，Ad hoc polymorphism, parametric polymorphism and subtyping. ([view more](http://en.wikipedia.org/wiki/Polymorphism_(computer_science)))


###性能细节

####局部与全局变量

局部变量的速度要比全局变量的访问速度更快，因为全局变量其实是全局对象的成员，而局部变量是放在函数的栈当中的。

    // 一段Jquery源码
    // 这里给undefined传入空参数是为了避免全局 undefined 被污染
    (function( window, undefined) {
    })(window);

    // 一段Ext源码
    window.undefined = window.undefined;

上面分别是摘自Jquery和Ext的一段源码，Jquery那段代码想表明的很简单，就是让window和undefined变为局部变量，而且这样做又是内部的全局，可以提高速度。

####类型转换

Javascript是动态型语言，所以可知你不能指定变量的类型，也因为如此我们常常会犯类型转换错误。

**转字符串**

把数字转换成字符串，应用`'' + s`，虽然看起来比较丑一点，但事实上这个效率是最高的，下面几种字符串转换的一个性能比较：

    ("" +) > String() > .toString() > new String();

"" + s写法其实和下面的“字面量”有点类似，尽量使用编译时就能使用的内部操作要比运行时使用的用户操作要快。String()属于内部函数，所以速度很快，而.toString()要查询原型中的函数，所以速度逊色一些，new String()用于返回一个精确的副本。对于自定义的对象，如果定义了toString()方法来进行类型转换的话，推荐显式调用toString()，因为内部的操作在尝试所有可能性之后，会尝试对象的toString()方法尝试能否转化为String，所以直接调用这个方法效率会更高。

**转Number型**

浮点数转换成整型，这个更容易出错，很多人喜欢使用parseInt()，其实parseInt()是用于将字符串转换成数字，new Number() 同样是返回一个精确的副本，只是方便提供一些自身的函数，但效率上会明显减低的。而如不是浮点数和整型之间的转换，我们应该使用Math.floor()或者Math.round()。因为， Math是内部对象，所以Math.floor()其实并没有多少查询方法和调用的时间，速度是最快的。

####使用字面量初始化变量

使用字面量定义,字面量是直接被引擎解释的。而常规的方式还需要调用构造函数：

    var str = '';
    var arr = [];
    var obj = {};

####循环过程的细节

空洞的文字不太好，我还是喜欢直接在代码中注释来描述：

    //基础版
    //每次循环都要计算一次arr的length
    for (var i = 0; i < arr.length; i++) {
        console.log(arr[i]) ;
    };

    //进阶1
    //只需要计算一次length
    for (var i = 0, le = arr.length ; i < le; i++ ) {
        console.log(arr[i]) ;
    }

    //进阶1.1
    //who care length!
    //但是这种方式有局限性，如果要遍历的对象中有元素是0或者''可以被判定为false的值，就悲剧了
    //所以这种方式慎用,尤其是团队协作的时候
    for (var i = 0, k ; k = arr[i] ; i++ ) {
        console.log(k) ;
    }
    
    //进阶2-倒序
    for (var i = arr.length ; i--; ) {
        console.log(arr[i]) ;
    }

常见的一个for循环，细细看来都有不少值得优化的细节。

###data type

在javascript有6中可识别的类型：Number, String, Boolean, undefined, function, Object。前面四种为值类型，后面两种为引用类型。(关于js数据类型，爱明有他自己的见解)

####undefined与null及NaN

有同学undefined和null傻傻分不清楚，可能是由于`undefined == null`返回true了导致，其实JS的`==`运算符是会自动转换类型的。undefined不是js的关键字，但是全局变量。通常在以下几种情况会出现undefined：

- 对未定义的变量进行typeof操作，`typeof x`  (这是typeof为数不多的技能)
- 引用了已经定义但没有赋值的变量
- 使用了一个对象的属性，但是该属性不存在或者未赋值
- 函数默认的返回值
- 函数返回值为`return ;`

Null可以看做Object类型的一个特殊值，如果一个对象的值为null，其表示该对象不是一个有效对象。对于null是如何工作也是有误解的，将一个对象引用设置为null，并没有使对象变“空”，只是将它的引用设置为空而已。

NaN(Not a Number)表示非数字,但是是Number类型. 为什么要提到这个，是因为许多开发者容易看到这东西第一反应和null扯在一起，以为是空对象了。还有在表示一个非数字值时（此处不考虑类型）可以调用方法isNaN().

####array-like对象

有些对象拥有array的一些特性，但又不完全是array。比如NodeList, arguments等. array-like对象如何转换成array对象呢？针对标准浏览器可以借用array的slice方法来转换，但是低端IE不支持，严格说，在IE内部定义了一个抽象类Arraioid，Array和Arguments都继承于此，所以可以用slice。但DOM对象是通过COM接入到JScript的，slice检测的时候失效。通用方案可以参考ext的实现：

    // ext snippet
    toArray : function(){
        return isIE ?
            function(a, i, j, res){
                res = [];
                Ext.each(a, function(v) {
                    res.push(v);
                });
                return res.slice(i || 0, j || res.length);
            } :
            function(a, i, j){
                return Array.prototype.slice.call(a, i || 0, j || a.length);
            }
    }()


####判断类型

从最开始的typeof，到constructor和instanceof操作。这些方法都不是很完善，在JQuery源码中发现了更好的判断方法：

    var toString = Object.prototype.toString;
    isArray: function(v){
        return toString.apply(v) === '[object Array]'
    }


####数据删除delete

最新的chrome的测试结果:

    var o_local = new Object();
    o_global = new Object();
    delete o_local; 
    console.log(o_local) // o_local依然存在
    delete o_global;
    console.log(o_global) // o_global is undefined

    var str_local = 'str';
    str_global = 'str';
    delete str_local; // str_local 依然存在
    console.log(str_local);
    delete str_global;
    console.log(str_global); //str_global is undefined

不难看出，只能删除全局变量，通过var定义的变量是无法被delete的。另外不建议直接删除对象的属性，如果不再使用某个属性，可以将其设置为Null。

###运算符

####一元运算符
    
    //translate Date type to Number
    var cur_time = +new Date()

    +function(){
        console.log('invoked') ;
    }()
    ~function(){
        console.log('invoked too') ;
    }()

####逗号运算符

    // count is 20
    var count = (2,10) 

####==和===的区别

==运算过程中，JS解释器会强制转换类型后比较，所以`1==true`是true，详细的转换规则请查阅ECMA262文档。那么`===`就是既要值相等，也要类型相同了。所以一般我们都建议使用`===`来做判断。

###善用&&和||

很常见的情况是，我们要根据某个变量的值来决定下一步的操作。我们一般会用if判断来处理：

    if(flag){
        foo()
    }
    //你或许会用三元选择符来写
    flag ? foo() : ''

然而你可以写得更轻巧飘逸(python都没法这么洒脱)：
    
    flag && foo()
    //你还可以这样
    //如果parentNodeId存在则返回根据这个id查询的到的DOM对象，否则返回body对象
    var parentNode = parentNodeId && document.querySelectorAll(parentNodeId) || document.body

使用&&和||来控制流程还是很方便的，jQuery的代码好多地方都有这么写过。

###function的隐藏细节

有五大属性可能经常被用到：length, arguments,  arguments.callee, arguments.caller, prototype

length即是function的形参的length。

arguments是function的实参，不一定等于形参。一般可以在调试的时候使用它来探测function传入的所有参数.

arguments还有两个相当有用的属性callee和caller。caller指向当前在运行的函数的**调用者**，比如我想探测当前函数是被在哪个函数中被调用的，就可以使用`arguments.callee.caller`。如果是在顶级作用域(window)中直接调用的，则返回null。

callee指向当前执行的函数，在匿名函数中递归调用自身的时候非常有用。但是在ES5的strict模式已经被禁用了。MDN中有记载禁用的原因，在早期的JS版本中，不允许给函数表达式命名，所以在匿名函数中调用自身就成了个问题。所以引入了arugments.callee来解决。但是也引来一个问题—-通过这种方式再次调用自身时，会改变this的引用，如：

    var sillyFunction = function (recursed) {
        alert("This is: " + this);
        //再次调用是，this指向了arguments对象
        if (!recursed) { return arguments.callee( true); }
    }

    sillyFunction();

当然聪明的开发者还是有办法解决的,如：

    //通过call来重设this对象
    var sillyFunction = function (recursed) {
        alert("This is: " + this);
        if (!recursed) { return arguments.callee.call(this, true); }
    }

    sillyFunction();

####function调用的方式

首先看三种调用函数的方式：
    
    //方式1
    (function(){
        //code
    }())

    //方式2
    (function(){
        //code
    })()

    //方式3
    void function(){
        //code
    }()

由里到外，有上到下的顺序解释下每个括号的用意。

- 方式一：函数参数列表占位符，函数调用运算符，强制运算符。
- 方式二：函数参数列表占位符，强制运算符，函数调用运算符。

我们看到方式一与方式二基本一致。但事实上两种表达式的运算过程略有不同：方式一中是用强制运算符使函数调用运算得以执行，方式二中则用强制运算符运算“函数直接量声明”这个表达式，并返回一个函数自身的引用，然后通过函数调用运算符“( )”来操作这个函数引用

方式三，则用于“调用函数并忽略返回值”。运算符void 用于使其后的函数表达式执行运算。

###prototype chain

JSer必须了解的两条链：prototype chain , scope chain .先说prototype

coming soon...

###scope chain


