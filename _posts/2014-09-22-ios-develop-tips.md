---
layout: post
title: "iOS开发中小技巧"
description: "偶尔在搜索问题答案时，会有额外的收获。让你忍不住想，原来还可以这么干，太方便了，于是逐步记录着"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}
偶尔在搜索问题答案时，会有额外的收获。让你忍不住想，原来还可以这么干，太方便了，于是逐步记录着

###退回输入键盘：
    - (BOOL) textFieldShouldReturn:(id)textField{ 
        [textField  resignFirstResponder]; 
    } 

###绘制CGRect ,以及CGPoint & CGSize
    CGRect frame = CGRectMake (origin.x, origin.y, size.width, size.height)；矩形 
    NSStringFromCGRect(someCG) 把CGRect结构转变为格式化字符串； 
    CGRectFromString(aString) 由字符串恢复出矩形； 
    CGRectInset(aRect) 创建较小或较大的矩形（中心点相同），＋较小  －较大 
    CGRectIntersectsRect(rect1, rect2) 判断两矩形是否交叉，是否重叠 
    CGRectZero 高度和宽度为零的／位于（0，0）的矩形常量 
    CGPoint aPoint = CGPointMake(x, y);    CGSize aSize = CGSizeMake(width, height); 

###隐藏状态栏：

     [[UIApplication shareApplication] setStatusBarHidden: YES animated:NO] 

###横屏：

    [[UIApplication shareApplication] setStatusBarOrientation:UIInterfaceOrientationLandscapeRight]. 
    orientation == UIInterfaceOrientationLandscapeLeft 
    window=[[UIWindow alloc] initWithFrame:[UIScreen mainScreen] bounds];全屏 

###自动适应父视图大小：

    aView.autoresizingSubviews = YES; 
    aView.autoresizingMask = (UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight); 

###设置视图背景图片

    UIImageView *aView; 
    [aView setImage:[UIImage imageNamed:@”name.png”]]; 
    view1.backgroundColor = [UIColor colorWithPatternImage:[UIImage imageNamed:@"image1.png"]]; 
    UISlider *slider = (UISlider *) sender; 
    NSString *newText = [[NSString alloc] initWithFormat:@”%d”, (int)(slider.value + 0.5f)]; 
    label.text = newText; 

###动画效果

    -(void)doChange:(id)sender 
    { 
        if(view2 == nil) 
    { 
        [self loadSec]; 
    } 
    [UIView beginAnimations:nil context:NULL]; 
    [UIView setAnimationDuration:1]; 
    [UIView setAnimationTransition:([view1 superview] ? UIViewAnimationTransitionFlipFromLeft : UIViewAnimationTransitionFlipFromRight)forView : self.view cache:YES]; 
    if([view1 superview]!= nil) 
    { 
        [view1 removeFromSuperview]; 
        [self.view addSubview:view2]; 
    }else{ 
        [view2 removeFromSuperview]; 
        [self.view addSubview:view1]; 
    } 
    [UIView commitAnimations]; 
    
###随机数的使用

    #import <time.h> 
    #import <mach/mach_time.h> 
    srandom()的使用 
    srandom((unsigned)(mach_absolute_time() & 0xFFFFFFFF)); 
    //直接使用 random() 来调用随机数 

###在UIImageView 中旋转图像

    float rotateAngle = M_PI; 
    CGAffineTransform transform =CGAffineTransformMakeRotation(rotateAngle); 
    imageView.transform = transform; 

###读取一般性文档文件

    NSString *tmp; 
    NSArray *lines;/*将文件转化为一行一行的*/ 
    lines = [[NSString  stringWithContentsOfFile:@"testFileReadLines.txt"] componentsSeparatedByString:@”\n”]; 
    NSEnumerator *nse = [lines objectEnumerator]; 
    // 读取<>里的内容 
    while(tmp = [nse nextObject]) { 
        NSString *stringBetweenBrackets = nil; 
        NSScanner *scanner = [NSScanner scannerWithString:tmp]; 
        [scanner scanUpToString:@"<"intoString:nil]; 
        [scanner scanString:@"<"intoString:nil]; 
        [scanner scanUpToString:@">"intoString:&stringBetweenBrackets]; 
        NSLog([stringBetweenBrackets description]); 
    } 
