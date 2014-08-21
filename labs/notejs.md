###js

###基本特点

####解释性语言(interpreted language)

编译型语言必须先通过编译才能执行, JavaScript是一种解释性语言，而解释性语言不需要编译，直接从上到下解释执行，一边解释一边执行，这就决定了解释性语言的代码是有先后顺序的，需要执行的代码必须已经解释过。因此，JavaScript需要注意代码的先后顺序。

todo: preComplie

####弱类型

大部分面向对象语言都是强类型语言,强类型语言是一种需要强制类型定义的语言. 它要求每个变量都确定某一种类型，它和别的类型转换必须显式转换。JavaScript是一种弱类型语言，弱类型语言是一种类型可以被忽略的语言，它在变量定义时不指定某一类型，在执行时通过执行结果才能确定类型，不同类型之间不需要通过显式转换就可以转换。

####动态添加属性和方法

我们可以动态为某个对象添加以前没有的属性和方法。这个特点使JavaScript非常灵活，正因为有了这个特点，JavaScript的面向对象编程才有了可能。

####prototype

prototype属性返回对象的所有属性和方法，所有 JavaScript 内部对象都有只读的 prototype 属性，可以向其原型中动态添加属性和方法，但该对象不能被赋予不同的原型。但是自定义的对象可以被赋给新的原型。


面向对象编程
面向对象有下列三个主要特点：封装、继承和多态。这里先详细说明这几个特点，后面几个部分分别在JavaScript中实现这些特点，从而实现完整的面向对象模拟。

- 封装：封装就是把各种方法和变量合并到一个类，用这个类代表某个对象为完成一定的任务所能保存的范围以及它能执行的操作。封装隐藏了方法执行的细节。
- 继承：继承就是根据现有类的方法和成员变量生成新的类的功能。
- 多态：多态就是对象随着程序执行而使其形式发生改变的能力。在python中，多态被这样描述：This is called **polymorphism** where a sub-type can be substituted in any situation where a parent type is expected i.e. the object can be treated as an instance of the parent class. wikipedia中将多态分为了三类，Ad hoc polymorphism, parametric polymorphism and subtyping. ([view more](http://en.wikipedia.org/wiki/Polymorphism_(computer_science)))


###语言特性

- 解释性和编译型

- 动态语言和静态语言

动态类型语言：动态类型语言是指在运行期间才去做数据类型检查的语言，也就是说，在用动态类型的语言编程时，永远也不用给任何变量指定数据类型，该语言会在你第一次赋值给变量时，在内部将数据类型记录下来。Python和Ruby就是一种典型的动态类型语言。静态类型语言：它的数据类型是在编译其间检查的，也就是说在写程序时要声明所有变量的数据类型，C/C++, OC是静态类型语言的典型代表，其他的静态类型语言还有C#、JAVA等。对于动态语言与静态语言的区分，套用一句流行的话就是：Static typing when possible, dynamic typing when needed。

    //Arr后缀表示这个变量是这个变量是Array类型
    var nameArr = ['Jim', 'Kate'];

    //convert variable type
    var nameStr = nameStr.join('-');

- 弱类型定义和强类型定义

强类型定义，比如若一个变量a被赋值为数字，那么程序无法将a当作字符串去处理(除非我通过代码将a转换为字符串方式)。程序不会处理不是规定类型的变量(我只接受str类型变量，你要传入int类型的，我就生气报错了)。弱类型定义，数字变量也可以当作字符串处理，如：

    //python是强类型的动态语言
    //in python
    list = [1,2,3]
    print ''.join(list) //报错，join是string的方法，它所需要的参数必须要是string类型的

    //in JS
    alert(1 + 'zbc') // Js解释器会自动做类型转换


###性能细节

局部变量比全局变量快

###data type

###运算符

- 一元元算符
- 括号运算符

###function的隐藏细节
- arguments
- arguments.callee
- arguments.caller
- length
- prototype

- call , apply
- closure

###breakpoint


