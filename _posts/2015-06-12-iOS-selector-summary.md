---
layout: post
title: "Selector使用小结"
description: "可以简单理解 @selector()就是取类方法的编号，他的行为基本可以等同C语言的中函数指针,只不过C语言中，可以把函数名直接赋给一个函数指针，而OC的类不能直接应用函数指针，这样只能做一个@selector语法来取。它的结果是一个SEL类型。这个类型本质是类方法的编号(函数地址)。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

可以简单理解`@selector()`就是取类方法的编号，他的行为基本可以等同C语言的中函数指针,只不过C语言中，可以把函数名直接赋给一个函数指针，而OC的类不能直接应用函数指针，这样只能做一个@selector语法来取。它的结果是一个SEL类型。这个类型本质是类方法的编号(函数地址)。

###Cpp和OC中的函数指针

在Cpp中：

    int test(int val)
    {
        return val+1;
    }
    //定义一个函数指针变量c_func = add ;
    //把函数addr地址直接赋给c_func
    int (* c_func)(int val); 

在OC中：

    @interface foo
    -(int)add: (int) val;
    @end

    //定义一个类方法指针
    SEL class_func ;
    class_func = @selector(add:val);

*注意: @selector是查找当前类（含子类）的方法。*

###举例说明

父类头文件：

    #import <Foundation/Foundation.h>  
    @interface SelectorDemo : NSObject  
      
    @property (nonatomic, weak) SEL methodTest;
      
    -(void)TestParentMethod;  
    -(void)TestSubMethod;  
    @end  

父类源文件：

    #import "SelectorDemo.h"  
      
    @implementation SelectorDemo  
      
    -(void)parentMethod  
    {  
        NSLog(@"parent method Call Success!");  
    }  
      
    -(void)TestParentMethod  
    {  
        if (_methodTest)  
        {  
            [self performSelector:_methodTest withObject:nil];  
        }  
    }  
      
    -(void)TestSubMethod  
    {  
        if (_methodTest)  
        {  
            [self performSelector:_methodTest withObject:nil];  
        }  
    }  
    @end 

子类头文件：

    #import <Foundation/Foundation.h>  
    #import "SelectorDemo.h"  
      
    @interface SelectorSub : SelectorDemo  
      
    @end  
    

子类源文件：

    #import "SelectorSub.h"  
      
    @implementation SelectorSub  
      
    -(void)SubMethod  
    {  
        NSLog(@"Sub method Call Success!");  
    }  
      
    @end  

测试调用：

    SelectorSub *ss = [[SelectorSub alloc]init];  

    ss.methodTest = @selector(parentMethod);  
    [ss TestParentMethod];  
    ss.methodTest = @selector(SubMethod);  
    [ss TestParentMethod];  
    [ss release];  

相关解释：

- `ss.methodTest = @selector(parentMethod);` 这句在运行期时，会寻找到父类中的方法进行调用。
- `ss.methodTest = @selector(SubMethod);` 这句就在运行期时，会先寻找父类，如果父类没有，则寻找子类。
- 如果这里将`ss.methodTest = @selector(test);` 其中test既不是ss父类，也不是ss本身，也非SS子类，哪么这个时候在使用`[self performSelector:_methodTest withObject:nil];`就会出现地址寻找出错 。

###其他扩展

下面两行代码是等价的：

    [friend performSelector:@selector(gossipAbout:) withObject:aNeighbor];  

    [friend gossipAbout:aNeighbor];  

通过这个原理，当把属性设置为SEL类型时，如果回调机制使用的不是SEL声明的类或子类。想实现其它类的回调，必须传入其它类的上下文句柄。

将demo稍微调整下，头文件：


    #import <Foundation/Foundation.h>  
      
    @interface SelectorDemo : NSObject  
    {  
        SEL _methodTest;  
        id _handle;  
    }  
      
    @property (nonatomic,assign) SEL methodTest;  
    @property (nonatomic,retain) id handle;
    -(void)TestParentMethod;  
    -(void)TestSubMethod;  
      
    @end  

源文件：

    #import "SelectorDemo.h"  
      
    @implementation SelectorDemo  
      
    @synthesize methodTest = _methodTest;  
    @synthesize handle = _handle;  
      
    -(void)parentMethod  
    {  
        NSLog(@"parent method Call Success!");  
    }  
      
    -(void)TestParentMethod  
    {  
        if (_methodTest)  
        {  
            //这里面原来self属为相应的实例句柄  
            [_handle performSelector:_methodTest withObject:nil];
        }  
    }  
      
    -(void)TestSubMethod  
    {  
        if (_methodTest)  
        {  
            [_handle performSelector:_methodTest withObject:nil];  
        }  
    }  
    @end  


