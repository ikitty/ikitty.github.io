---
layout: post
title: "学习target-action设计模式"
description: "在处理用户－接口控件方面，AppKit充分发挥了在运行时改变接收者和消息的能力。NSControl对象是一个图形设备，可以用来向应用程序发送指令。大多实现了现实世界中的控制装置，例如button、switch、knob、text field、dial、menu item等。在软件中，这些设备处于用户和和应用程序之间。它们解释来自硬件设备，如键盘和鼠标的事件，并将它们翻译成应用程序特定的指令。例如，名为“Find”的按钮将会把鼠标点击事件翻译成开始搜索的应用程序指令。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

在处理用户－接口控件方面，AppKit充分发挥了在运行时改变接收者和消息的能力。NSControl对象是一个图形设备，可以用来向应用程序发送指令。大多实现了现实世界中的控制装置，例如button、switch、knob、text field、dial、menu item等。在软件中，这些设备处于用户和和应用程序之间。它们解释来自硬件设备，如键盘和鼠标的事件，并将它们翻译成应用程序特定的指令。例如，名为“Find”的按钮将会把鼠标点击事件翻译成开始搜索的应用程序指令。

AppKit为创建控件设备定义了模板，并定义了一些自己的现成设备。例如，NSButtonCell类定义了一个对象，可以指派给一个NSMatrix实例，并初始化它的大小、名称、图片、字体和键盘快捷键。当用户点击按钮（或使用键盘快捷键）时，NSButtonCell对象发送消息，指示应用程序工作。为此，NSButtonCell对象不仅要初始化图像、大小和名称，还要确定消息要发往何方和发给谁。相应地，NSButtonCell实例可以为一个action消息（它将在自己发送的消息中使用的对象选择器）和一个target（接收该消息的对象）进行初始化。

    [myButtonCell setAction:@selector(reapTheWind:)];  
    [myButtonCell setTarget:anObject];  

当用户点击了相应的按钮，该按钮单元将使用NSObject协议方法`performSelector:withObject:`发送消息。所有action消息带有单独一个参数，既发送该消息的控件设备的id。

如果Objective-C不允许改变消息，所有的NSButtonCell对象将不得不发送相同的消息，方法的名字将在NSButtonCell源代码中写死。与简单的实现将用户action转换为action消息的机制不同，按钮单元和其他控件不得不限制消息的内容。受限的消息会使很多对象难以响应多于一个的按钮单元。要么每个按钮有一个target，要么target对象能发现消息来自于那个按钮，并做相应处理。每次在重新布局用户接口时，你也必须实现响应action消息的方法。动态消息的缺乏将会带来不必要的麻烦，但Objective-C很好地避免了这一点。

根据前几天用到的selector的demo可以得知如果SEL不是自身的方法，在调用时就会出错，引起CRASH，哪么如何避免消息传递引起的错误?

如果一个对象接收了一条消息去执行不归它管的方法，就会产生错误结果。这和调用一个不存在的函数是同一类错误。但是，因为消息发生在运行时，错误只有在程序执行后才会出现。当消息选择器是常数并且接收对象类已知时，处理这种错误相对容易。在写程序时，你可以确保接收者能够响应。如果接收者时静态类型，编译器将替你完成该测试。但是，如果消息选择器或接收者是变化的，那么只能在运行时进行相关测试。NSObject类中定义的respondsToSelector:方法可以测试一个接收者是否能够响应某条消息。它将方法选择器作为参数并返回接收者是否已经访问了与选择器相匹配的一个方法：

    if ( [anObject respondsToSelector:@selector(setOrigin::)] )  
        [anObject setOrigin:0.0 :0.0];  
    else  
        fprintf(stderr, "%s can’t be placed\n",  
            [NSStringFromClass([anObject class]) UTF8String]);  

当你向一个你在编译时无法控制的对象发送消息时，respondsToSelector:运行时测试非常重要。例如，如果你写了一段代码向一个对象发送消息，而这个对象是一个他人可以设定值的变量，那么你就要确保接收者实现了响应该消息的方法。

有一些需要注意的地方：

- 一个对象在收到不是自己负责直接响应的消息时可以转发该消息给其他对象。这种情况下，从调用者的角度来看，对象直接处理了消息，尽管该对象是通过转发消息给其他对象来处理的。
- 查找类方法时，除了方法名,方法参数也是查询条件之一.
- 可以用字符串来找方法 `SEL var = NSSelectorFromString(方法名字的字符串);`
- 可以运行中用SEL变量反向查出方法名字字符串，如：`NSString *method = NSStringFromSelector(setWidthHeight);`
- SEL 查找的方法不支持类方法（即静态方法，在C++中带static关键字的，在OBJECT-C中即方法前带+号的）。

