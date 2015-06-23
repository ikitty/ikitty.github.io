---
layout: post
title: "自制一个简单的LoadingIndicator类"
description: "回头看自己做的第一个完整App，代码简直惨不忍睹。就像用胶水勉强粘在一起的破蜘蛛网，虽然能跑通逻辑，但可读性一点都不好，挨了一周，终于下定决心重构代码。先从一个小的Loading展示做起。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

回头看自己做的第一个完整App，代码简直惨不忍睹。就像用胶水勉强粘在一起的破蜘蛛网，虽然能跑通逻辑，但可读性一点都不好，挨了一周，终于下定决心重构代码。先从一个小的Loading展示做起。

###思路

先说下表现。loadingIndicator包含三个元素，一个半透明黑色圆角矩形，在这个矩形里面，有个加载指示器（旋转菊花图）,然后是一段加载文件（拼命加载中）。这其中的加载指示器也可以用imageView来引入一个自定义的gif图片。

我们要做的是，在类中预订义好这些UI控件，然后在实际场景中调用显示即可。当然，也要支持传入自定义文案等。

###定义LoadingIndicator类

头文件，我们简单的定义了`show:txtMsg`和`hide`两个方法来显示和隐藏加载器：

    #import <UIKit/UIKit.h>

    @interface loadingIndicator : UIView
    {
        //菊花图
        UIActivityIndicatorView* actIndicator ;
        //加载文案
        UILabel* msg ;
    }

    - (id)init;
    - (void)show:(NSString*)txtMsg;
    - (void)hide;
    @end

接下来在源文件中实现几个功能，首先是初始化，主要是创建UI控件，并设置好相关的样式：

    #import "loadingIndicator.h"
    @implementation loadingIndicator

    - (id)init
    {
        if (self = [super initWithFrame:CGRectMake(50, 50, 100, 100)]) {
            self.backgroundColor = [UIColor blackColor];
            self.alpha = 0.8;
            self.layer.cornerRadius = 5 ;

            msg = [[UILabel alloc]initWithFrame:CGRectMake(0, 70, 100, 30)];
            msg.text = @"Loading...";
            msg.textColor = [UIColor whiteColor];
            msg.textAlignment = NSTextAlignmentCenter;
            msg.font = [UIFont fontWithName:@"Arial" size:16.0];
            [self addSubview:msg];

            actIndicator = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:UIActivityIndicatorViewStyleWhiteLarge];
            actIndicator.frame = CGRectMake(25, 10, 50, 50);
            [self addSubview:actIndicator];
            self.hidden = YES;
        }
        return self;
    }

实现显示和隐藏的方法：

    - (void)show:(NSString *)txtMsg
    {
        msg.text = txtMsg;
        [actIndicator startAnimating];
        self.hidden = NO;
        // 一句搞定居中
        self.center = self.superview.center;
    }
    -(void)hide
    {
        [actIndicator startAnimating];
        self.hidden = YES;
    }
    @end

###实际使用

在实际需要的场景中初始化类，并调用`show:txtMsg`方法就可以了：

    - (void)webViewDidStartLoad:(UIWebView *)webView
    {
        loading = [[loadingIndicator alloc] init];
        [self.view addSubview:loading];
        [loading show:@"拼命加载哦"];
    }
    
**注意：如果是在异步线程中调用loadingIndicator，记得要切回到主线程才能正确调用哦。**

