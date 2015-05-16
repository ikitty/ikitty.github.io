---
layout: post
title: "iOS-Block初步理解"
description: "这个月更新笔记似乎没那么频繁了，其实不然。而是学到Block这里的时候有点卡了，可能是我英文阅读不够火候，这个章节进度有点慢。一开始一些词汇也不知道怎么理解，但是结合后面的代码就容易理解了。Block的概念并不是只在OC中才存在，其他语言中也有类似的东西，比如JS中的闭包。Apple在iOS4中引入了block，由于其不错的表现，使得Apple在后续的版本中重写了很多内置框架来兼容block。而且似乎有种夸张的趋势：如果你不会block，那你写个毛的OC哦-_-!。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

这个月更新笔记似乎没那么频繁了，其实不然。而是学到Block这里的时候有点卡了，可能是我英文阅读不够火候，这个章节进度有点慢。一开始一些词汇也不知道怎么理解，但是结合后面的代码就容易理解了。Block的概念并不是只在OC中才存在，其他语言中也有类似的东西，比如JS中的闭包。Apple在iOS4中引入了block，由于其不错的表现，使得Apple在后续的版本中重写了很多内置框架来兼容block。而且似乎有种夸张的趋势：如果你不会block，那你写个毛的OC哦-_-!。

###基本概念

block到底是什么？它是一个字闭合的代码片段。block里面的代码能和外部的代码进行交互。但外部的代码是不知道block内部的运行状态的。block也能通过特殊的方式修改外部作用域的变量（要通过特殊方式）。简答来说，它有两个特性：

- block能滞后再执行
- 使用block能让你的代码更加干净整洁，他可以替代方法委托。

基于后面一点，block提供一个很好的解决方案。那就是使用回调函数来代替委托，因为block可以在他们执行的时候去申明和实现。这样一来，我们就不需要再去关注对应的协议和实现协议中必要的方法了。更棒的是回调函数能直接访问和使用block定义时的作用域中的变量，也省去传参的步骤。当然block也不是万能的，最好的方法是组合使用block和委托。

**block是一种对象**，所以它能以数组或字典的形式存储，也能通过方法返回，或者赋值给变量。

###Demo概览

今天这个demo是由多个相互依赖的部分组成的。我本可以直接写一个命令行的demo的，但是为了展示一个UI相关的内容，所以还是做一个真正的App。首先，我们写一些在debugger中展示的代码，因为我们的目的主要是在`block`上。稍后，我们也做一些UI方便的展示，以便成为一个完整的App。整个过程中最重要的还是集中在Block。

###开始

创建一个SingleViewApp，命名为BlockDemo。首先申明，这个demo中，我们可以把所有的代码中写到`viewDidLoad`方法中。当然，以防万一，你也可以写在自己想写的地方。

###Block的语法：

**Block的声明**

    ReturnType (^blockName)(parameters)

很像C的函数定义，只是多了一个插入符（`^`），让我们逐步来看语法解释：

- ReturnType 可以是任何OC支持的数据类型，如果没有返回值，就用void
- ^blockName 可以是任何字符串（就像变量名和方法名一样），记得保持用括号包含插入符和blockName
- Parameters 表示你先传递给block的所有参数，如果你没有传递任何参数，请记得要设置void标记，另外，参数也必须用括号包含起来

一些block的示例：

    int (^myBlock)(NSString *name, int age);
    void (^showName)(NSString *name);
    void (^testVoid)(void);
    NSDate *(^showDate)(void);

一开始，`^`和那些括号看起来有点让人迷糊，不过马上你就会用到它，并且对它爱不释手了。

在申明block时比较特殊的一点是我们可以省略参数中的变量名，因为，编译器根本不care这个变量名的，写变量名只是为了方便开发者查阅代码的。所以，上面的示例代码可以简写为：

    int (^myBlock)(NSString *, int );
    void (^showName)(NSString *);
    //当然 空参数的void标识是不能省略的
    void (^testVoid)(void);

**block的定义**

现在，我们来看看block的定义。如：

    ^(Parameters){
        //block body ...
        //如果返回值为void，可以不写
        return ReturnValue;
    };

如你所见，block定义时是不需要写blockName的，但是参数名是必须要写的，另外，请记得给block最后加上分号。因为整个block就相当于一个变量。完整的代码如：

    ^(int a, int b){
        int result = a * b;
        return result;
    };

当然，实际使用中的block没这么简单，有可能是直接将一个block定义赋值给变量：

    int (^howMany)(int, int) = ^(int a, int b){
        return a + b;
    };
    void (^justAMessage)(NSString *) = ^(NSString *message){
       NSLog(@"%@", message);
    };

另外，block的声明和定义也不一定在同时发生，可以先申明，后定义：

    // Declare a block variable.
    void (^xyz)(void);
    // Some other code...
    // Define the block.
    xyz = ^(void){
        NSLog(@"What's up, Doc?");
    };

我们还可以将block当作类的成员变量使用。

    @interface ViewController ()
    @property (nonatomic, strong) NSString *(^blockAsAMemberVar)(void);
    @end
    //然后在viewDidLoad中定义
    _blockAsAMemberVar = ^(void){
        return @"This block is declared as a member variable!";
    };

**Block的调用**

到现在为止，我们介绍了block的申明和定义，接下来将要介绍如何去**调用block**。

    int (^howMany)(int, int) = ^(int a, int b){
        return a + b;
    };
    NSLog(@"%d", howmany(5, 10));

    NSDate *(^today)(void);
    today = ^(void){
        return [NSDate date];
    };
    NSLog(@"%@", today());

再来个自执行的匿名block：

    float results = ^(float value1, float value2, float value3){
        return value1 * value2 * value3;
    } (1.2, 3.4, 5.6);
    NSLog(@"%f", results);

我们还可以使用定义外部的变量：

    int factor = 5;
    int (^newResult)(void) = ^(void){
        return factor * 10;
    };

    NSLog(@"%d", newResult());
    
相信到此为止，我们对block的概念和使用方法都有初步了解了。接下来继续了解更多的特性。

###__block存储类型

block内部的代码是可以访问block声明的作用域中的变量的。但只能读取，不能写入。我将通过一个简单的例子来说明。首先，我们创建一个私有方法：

    @interface ViewController ()
    -(void)testBlockStorageType;
    @end

然后在加载后去调用：

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        [self testBlockStorageType];
    }

现在我们来实现`testBlockStorageType`方法：

    -(void)testBlockStorageType{
        int someValue = 10;
        int (^myOperation)(void) = ^(void){
            someValue += 5;
            return someValue + 10;
        };
        NSLog(@"%d", myOperation());
    }

这里xcode会报错，前面我们也说过了，block内部无法对外部的变量进行写入。还好，oc提供了一个叫`__block`特殊的存储修改器（storage type modifier）。`__block`要在变量申明的时候使用。它的作用就让变量是可变的，如：

    __block int someValue = 10 ;

###Blocks As Completion Handlers

`Completion Handlers`（看完后面几段，可以简单的理解为回调）是一种通过block实现回调功能的方式，前面提到block能替代委托。解决方案就是使用Block作为completion handler。

Completion Handlers是一个block作为参数传递给方法，在这个方法中会实现一个回调，在一定时间后，block会被执行。不仅如此，block也要在方法执行的时候去定义。

有一点要注意，务必将Completion Handler当最后一个参数传入。

    //todo 这里的^为什么要用括号呢
    -(returnType)method:(parameterType)parameterName ...<more params>... andCompletionHandler:(void(^)(<any block params>))completionHandler;

实现：

    -(returnType)method:(parameterType)parameterName ...<more params>... andCompletionHandler:(void(^)(<any block params>))completionHandler{
        // When the callback should happen:
        completionHandler(<any required parameters>);
    }

Comletion Handler是在方法被调用后才定义的：

    [self methodNameWithParams:parameter1 ...<more params>... andCompletionHandler:^(<any block params>){
        // The completion handler code is added here after the method has finished execution and has made a callback.
    }];
    
结合实例理解，比如在展示模态对话框后，我们要处理其他的动作（比如打印一条log）：

    [self presentViewController:viewController animated:YES completion:^{
        NSLog(@"View Controller was presented...");
        // Other code related to view controller presentation...
    }];

    //在动画过程中
    [UIView animateWithDuration:0.5
                     animations:^{
                         // Animation-related code here...
                         [self.view setAlpha:0.5];
                     }
                     completion:^(BOOL finished) {
                         // Any completion handler related code here...
                         NSLog(@"Animation is over.");
                     }];

通过一个完整的实例来理解，首先来定义方法：

    @interface ViewController ()
    ...
    -(void)addNumber:(int)number1 withNumber:(int)number2 andCompletionHandler:(void (^)(int result))completionHandler;
    @end

如果所见，我们定义了三个参数，前面两个是要做加法的数字，最后一个是回调函数（回调的方法名可以随意），在回调函数中，我们只写了一个result参数，这个result是回调要传给回调函数的。实现方法：

    -(void)addNumber:(int)number1 withNumber:(int)number2 andCompletionHandler:(void (^)(int result))completionHandler{
        int result = number1 + number2;
        completionHandler(result);
    }

在加载后调用方法：

    - (void)viewDidLoad
    {
        ...
        [self addNumber:5 withNumber:7 andCompletionHandler:^(int result) {
            // We just log the result, no need to do anything else.
            NSLog(@"The result is %d", result);
        }];
    }

显然，用回调的方式比用协议或者代理直观和方便。

###稍微小结下

- block是代码块
- 申明格式: `ReturnType (^blockName)(parameters)`，声明时可以不用指定参数名，如果没有参数请填写void
- 定义格式: `^(params){//body}`，定义时不需要blockName，一定要加上参数名
- 可以写成自执行的匿名形式
- 最大的用途：当作completion handler的回调来使用
