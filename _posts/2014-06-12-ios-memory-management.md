---
layout: post
title: "iOS内存管理笔记"
description: "无论你学习哪种编程语言，管理好应用的内存是非常有必要的，它能保证你的应用更健壮的运行。Objective C采用来引用自动引用计数（automatically reference count）来管理内存，每个对象都有一个retainCount成员变量，来记录自己被引用的次数。当引用次数为0的时候，运行环境会自动释放内存。举个栗子：可能有多个人同时将狗绳套在小狗脖子上，只要还有一个人的狗绳套在小狗上，小狗就不会跑；反之，小狗就跑了。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

无论你学习哪种编程语言，管理好应用的内存是非常有必要的，它能保证你的应用更健壮的运行。Objective C采用来引用自动引用计数（automatically reference count）来管理内存，每个对象都有一个retainCount成员变量，来记录自己被引用的次数。当引用次数为0的时候，运行环境会自动释放内存。举个栗子：可能有多个人同时将狗绳套在小狗脖子上，只要还有一个人的狗绳套在小狗上，小狗就不会跑；反之，小狗就跑了。

###内存管理规则

- alloc，初始化时为对象分配内存，retainCount = 1
- copy, 复制一个新对象，新对象的retainCount = 1
- retain, 保留一个对象，该对象的retainCount += 1
- release, 释放一个对象，该对象的retainCount -= 1
- autorelease, 在未来某个时候释放一个对象, 对象会被自动添加到自动释放池, 自动释放池释放时, 向池中的所有对象 发送release消息.

来点代码说明可能更清晰：

    NSObject* obj1 = [[NSObject alloc] init];
    // obj1指向的对象的retainCount = 1

    NSObject* obj2 = [obj1 retain];
    // obj1指向的对象的retainCount = 2 ; 因为该对象同时被obj1和obj2引用

    [obj2 release];
    // obj1指向的对象的retainCount = 1 ; 只有obj1引用了

    [obj1 release];
    // obj1指向的对象的retainCount = 0 ; 此时对象被销毁

值得一提的是，在指针赋值的时候，retainCout是不会自动增加的，为了避免这种错误，我们需要在赋值的时候手动retain一次，让retain count 增加1。

    NSObject *a = [[NSObject  alloc]  init];
    // retain count = 1

    NSObject *b = a;
    // 此时retainCount不会增加

    [b retain];
    // 必须要手动retain一次，让 retain count = 2

    [a dealloc];
    // 此时指针b依然是有效，就避免空指针错误。

###自动释放池

Apple在OC中引入了自动释放池(Autorelease Pool)。在遵守一些规则的情况下，可以自动释放对象。但即使有这么一个工具，OC的内存仍需要时刻关注。

    NSObject *a = [[[NSObject alloc] init] autorelease];
    //retain count = 1，但无需release

原理：autorelease pool 全名叫做NSAutoreleasePool，是OC中的一个类。autorelease pool并不是天生就有的，你需要手动的去创建它:

    NSAutoreleasePool  *pool = [[NSAutoreleasePool  alloc]  init];

我用的是xCode5.1，在新建一个iPhone应用的时候，xcode已经自动地为我创建一个autorelease pool，这个pool就写在Main函数里面。

在NSAutoreleasePool中包含了一个可变数组，用来存储被声明为autorelease的对象。当NSAutoreleasePool自身被销毁的时候，它会遍历这个数组，release数组中的每一个成员（注意，这里只是release，并没有直接销毁对象）。若成员的retain count 大于1，那么对象没有被销毁，造成内存泄露。默认的NSAutoreleasePool 只有一个，你可以在你的程序中创建NSAutoreleasePool，被标记为autorelease的对象会跟最近的NSAutoreleasePool匹配。

    NSAutoreleasePool  *pool = [[NSAutoreleasePool  alloc]  init];

    //Create some obj
    [pool  release];

你也可以嵌套使用NSAutoreleasePool，即使NSAutoreleasePool看起来没有手动release那么繁琐，但是使用NSAutoreleasePool来管理内存的方法还是不推荐的。因为在一个NSAutoreleasePool里面，如果有大量对象被标记为autorelease，在程序运行的时候，内存会剧增，直到NSAutoreleasePool被销毁的时候才会释放。如果其中的对象足够的多，在运行过程中你可能会收到系统的低内存警告，或者直接crash。
 
如果你把Main函数中的NSAutoreleasePool代码删除掉，然后再自己的代码中把对象声明为autorelease，你会发现系统并不会给你发出错误信息或者警告。用内存检测工具去检测内存的话，你可能会发现你的对象仍然被销毁了。其实在新生成一个Run Loop的时候，系统会自动的创建一个NSAutoreleasePool，这个NSAutoreleasePool 无法被删除。
 
在做内存测试的时候，请不要用NSString。OC对字符串作了特殊处理，在输出str的retain count 的时候，你会发现retain count 大于1。

    NSString  *str  = [[NSString alloc]  stringWithString:@”HeyJ”];
    //Orz: retainCount > 1

后续在demo时候可能会碰到其他更诡异的内存管理问题，有了再更新到这里来。
