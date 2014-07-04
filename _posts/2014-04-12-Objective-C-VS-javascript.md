---
layout: post
title: "Objective C VS JavaScript"
description: "之前的编程语言主要是JavaScript，刚学OC时有蛮多不习惯的，所以从一个JSer的角度记录JavaScript和Objective C (下面简称JS和OC) 的差异。"
tags: [ Objective-c, javascript]
category: iOS
---
{% include JB/setup %}

之前的编程语言主要是JavaScript，刚学OC时有蛮多不习惯的，所以从一个JSer的角度记录JavaScript和Objective C (下面简称JS和OC) 的特点比较。

##JS和OC的差异

###type

弱类型，JavaScript中不需要申明变量类型即可直接使用;
变量走到那，类型跟到哪，开始学这个的可能会不习惯，比如：

    //JS
    var device = 'iPhone';
    var deviceType = ['4s', '5s'];

    //OC
    (NSString* )device = @"iPhone";
    (NSArray* )deviceType = [NSArray arrayWithObjects:@"4s",@"5s", nil];
    
另外，从上面的例子中也能发现，<s>OC中不能像JS那样方便的定义字面量变量</s> (后来在其他资料中发现也是可以用字面量来定于对象的，不过写法还是没有JS简洁，哈哈) 。不同类型的变量初始化时都要加上一堆冗余的申明。

###方法调用以及参数传输

还是感觉JS中的方法调用更加简洁，一目了然。另外OC中的调用方法通常称之为send message.

    //JS
    Object.method(arg)
    //OC
    [Object method:arg]

###一次执行多个方法

OC支持multiple method，多个method之间用空格分隔即可(第一次看到这种形式真是莫名其女)，和jQuery的链式调用有点类似

    //JS
    jQuery('#foo').css('color': 'red').show();

    //OC 
    - (BOOL) writeFile:(NSString*)path atomically:(BOOL)useXFile;
    
###Debug

调试代码也是我非常care的一个点。两种语言的调试方法都很方便，OC的写法略繁琐，如：

    //JS
    console.debug(foo);
    //OC
    NSLog ( @"The current date and time is: %@", [NSDate date] );

##JS和OC的共性

###nested call

JS和OC都支持嵌套调用，在JS中，我们可以将一个函数的结果作为参数传递给另外一个参数（这个特性很方便）。在OC中，我们也可以这么干，如：

    //js code
    obj.method(obj2.method2())

    //OC code 
    [obj method:[obj2 mehtod2]]

###Dot syntax

从OC 2.0开始，我们可用使用‘. ’语法来替代setter和getter操作。如：

    //JS
    obj.name = 'iPhone';
    console.log(obj.name);

    //OC setter and getter
    [obj setName:@"iPhone"];
    output = [obj name];

    //OC dot syntax is better
    obj.name = @"iPhone";
    output = obj.name ;

###Extend

OC中的categories允许你动态去扩展一个类的方法（不需要成为他的子类就可用用新方法）. 这个特性让我想起JS中的prototype。
比如我们经常对低版本浏览器扩展String的trim方法。

    //JS
    String.prototype.trim = function () {
        return this.replace(/^\s+|\s+$/g, '');
    }
    var myStr = ' iPhone';
    myStr.trim();

下面的代码展示了给NSString对象扩展一个isURL方法

    //OC code:
    //.h
    #import <Cocoa/Cocoa.h>
    @interface NSString (Utilities)
    - (BOOL) isURL;
    @end

    //.m
    #import "NSString-Utilities.h"
    @implementation NSString (Utilities)
    - (BOOL) isURL {
        if ( [self hasPrefix:@"http://"] )
            return YES;
        else
            return NO;
    }
    @end

    //use
    NSString* string1 = @"http://ikitty.github.io/";

    if ( [string1 isURL] )
        NSLog (@"string1 is a URL");
        
