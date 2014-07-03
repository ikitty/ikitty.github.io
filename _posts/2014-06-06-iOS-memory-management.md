---
layout: post
title: "iOS内存管理笔记"
description: " Objective C采用来引用自动引用计数（automatically reference count）来管理内存，每个对象都有一个retainCount成员变量，来记录自己被引用的次数。当引用次数为0的时候，运行环境会自动释放内存。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

Objective C采用来引用自动引用计数（automatically reference count）来管理内存，每个对象都有一个retainCount成员变量，来记录自己被引用的次数。当引用次数为0的时候，运行环境会自动释放内存。举个栗子：可能有多个人同时将狗绳套在小狗脖子上，只要还有一个人的狗绳套在小狗上，小狗就不会跑；反之，小狗就跑了。

###内存管理方法

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

###实践

