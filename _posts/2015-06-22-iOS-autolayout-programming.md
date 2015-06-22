---
layout: post
title: "AutoLayout之用代码编写约束"
description: "前端时间学习了Autolayout，在练习Demo中小试牛刀。感觉很实用，能满足自适应的需求。美中不足的是需要在storyboard中拖拖拽拽来添加约束，而且还要手动去Fix一些约束问题。这让我感觉回到了用DW拖拽HTML一样，很是麻烦（B格也掉了不少）。所以，在前几天又尝试用代码去编写约束。在开始前，我还在犹豫，既然在storyboard中能实现约束，为何还要去花时间学习用代码来控制呢？因为，我觉得用代码实现更灵活，更能了解到本质的东西。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

前端时间学习了Autolayout，在练习Demo中小试牛刀。感觉很实用，能满足自适应的需求。美中不足的是需要在storyboard中拖拖拽拽来添加约束，而且还要手动去Fix一些约束问题。这让我感觉回到了用DW拖拽HTML一样，很是麻烦（B格也掉了不少）。所以，在前几天又尝试用代码去编写约束。在开始前，我还在犹豫，既然在storyboard中能实现约束，为何还要去花时间学习用代码来控制呢？因为，我觉得用代码实现更灵活，更能了解到本质的东西。

iOS的约束是VFL(visual format language)语言实现的。

###基本的语法

    @"H:[testView(100)]"

上面的代码中，H即horizontal，表示水平方向，testView是要约束的view，整行代码表示在水平方向的尺寸是100pt，由于iOS设备可以旋转，所以没有用width来表示宽度。同理，如果要表示竖直方向的尺寸，我们就要用到对应的表示V（vertical）。如：`V:[testView(100)]`

###开始

在编写约束之前，我们需要关闭view的自动约束(在storyboard中fix约束问题是，应该也包含了这一步）,否则约束不会生效。

    redView.translatesAutoresizingMaskIntoConstraints = NO;

相信你也注意到VFL中都是字符串的形式，所以前面的`testView`是不能直接指向testView本身的，所以，我们需要将view以keyValue的形式定义在约束中。如下：

    //定义view dic
    NSDictionary *viewsDictionary = @{@"testView": redView};

    // V:[testView(100)] 中的testView就是viewsDictionary对应的key
    NSArray *constraint_H = [NSLayoutConstraint constraintsWithVisualFormat:@"V:[testView(100)]"
                                options:0 
                                metrics:nil
                                views:viewsDictionary];

    [redView addConstraints:constraint_H];

###使用间距

    Direction:|-spacingA-[viewKey]-spacingB-|

实例来说明：

    //redv 在水平方向距离superView前后的距离都是30 pt
    H:|-30-[redv]-30-|

    //同理，下面这句代码的表示 redv 占据整个superView的宽度
    H:|-0-[redv]-0-|

    //上面的0是不可以省略的，如果省略了，会使用默认的间距（默认是多少，我没查到，反正不是0）
    H:|-[redv]-|

    //当然上面的语句还可以约束多个view的间距，如下
    H:|-20-[aView]-50-[bView]-20-|

完整实例：

    NSDictionary *viewsDictionary = @{@"redv":self.redView};
    [self.view addConstraints:[NSLayoutConstraint 
    constraintsWithVisualFormat:@"H:|-0-[redv]-0-|" options:0 metrics:nil views:viewsDictionary]];

**注意：根据测试，间距的定义权值比宽高的权值高。**

###使用属性定义

options里面可以使用iOS预定义的方式创建约束，比如`NSLayoutFormatAlignAllTop`等。这里就不一一列举了。

    NSArray *constraint_POS = [NSLayoutConstraint constraintsWithVisualFormat:@"H:|-20-[redView]-10-[yellowView]"
                                                  options:NSLayoutFormatAlignAllTop
                                                  metrics:nil
                                                  views:viewsDictionary];

###使用Metrics

在metrics中定义变量，然后在constraint中使用这些变量（感觉可以在较大项目中使用）

    NSDictionary *metrics = @{@"redWidth": @100,
                              @"redHeight": @100,
                              @"topMargin": @20,
                              @"bottomMargin": @20
                              };
    //在VFL中就可以使用上面定义的key了
    NSArray *constraint_POS_V = [NSLayoutConstraint constraintsWithVisualFormat:@"V:|-topMargin-[redv]-bottomMargin-|"
                                        options:0
                                        metrics:metrics
                                        views:viewsDictionary];

###使用相对约束

注意这里是 `addConstraint` ，而不是 `addConstraints`

    [self.view addConstraint:[NSLayoutConstraint
          constraintWithItem:self.yellowView
                   attribute:NSLayoutAttributeWidth
                   relatedBy:NSLayoutRelationEqual
                      toItem:self.redView
                   attribute:NSLayoutAttributeWidth
                  multiplier:0.5
                    constant:0.0]];

上面的代码很直观，直接用下面的公式解释：

    yellowView.width = redView.width * 0.5 + 0.0;

定位方面的相对约束也很简单：

    [self.view addConstraint:[NSLayoutConstraint
          constraintWithItem:self.yellowView
                   attribute:NSLayoutAttributeCenterX
                   relatedBy:NSLayoutRelationEqual
                      toItem:self.redView
                   attribute:NSLayoutAttributeCenterX
                  multiplier:1.0
                    constant:0.0]];

转换成公式就是：

    yellowView.centerX = redView.centerX * 1.0 + 0.0;

###小结

上面的知识点只是我从资料中学习到的（也经过自己测试验证过），但在实际使用的过程中还是遇到了一些坑，比如：

- 无法给通过storyboard添加的view来创建约束，只能约束通过代码来创建的view。不知道是哪里出了差错。
- 改变tabbar的透明度(translucent)会对约束的效果有影响（这个真的是莫名其妙了）
