---
layout: post
title: "iOS练习-创建一个通用的App"
description: "通用App是指能同时兼容iPhone, iTouch 和iPad设备的App（类似网页自动适配pc端和移动端），为了达到完美的用户体验，用户只需要下载一个版本的App，就能在多个设备上使用。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

通用App是指能同时兼容iPhone, iTouch 和iPad设备的App（类似网页自动适配pc端和移动端），为了达到完美的用户体验，用户只需要下载一个版本的App，就能在多个设备上使用。

为了实现这种“自适应”的效果，我们还是需要做很多工作来优化我们的ViewController。在Xcode中，我们可以使用interface builder和storyboard来创建UI。但设计一个通用的App的流程取决于我们实现UI的方式。我们把两种方式都实践一下。

###使用storyboard来创建通用app

创建一个App，在设备选项中选择“universal”。现在你应该可以看到两个storyboard文件，如果你切换到项目简介中，你应该可以看到两个设备的deployment信息。

如你所见，每个设备都有它自己版本的storyboard。这样，我们才能为不同的设备自定义UI。

###开始

我们首先来设计iPhone版本的UI。加入一个imageView，并设置好背景图片。新增一个按钮，也设置好背景图片。然后切换到iPad版本。Xcode默认会为iPad版本生成一个ViewController，同样，我们也新增一个imageView和button，并设置好iPad版本的背景图。

到现在，我们就已经完成了一个非常简单的通用App。可以CMD+R来运行调试。

###ViewController类

那么，我们要为两个版本的UI使用同一个ViewController类吗？还是各自对应一个ViewController类？通常，各司其职是比较方便的。但，如果像上面的那么简单的demo，我们还是可以在同一个ViewController类里面处理的。

iOS SDK提供了`UI_USER_INTERFACE_IDIOM`宏来创建识别设备的条件代码。总之，这个宏让你很方便的识别设备类型。如果是iPad，这个宏返回的值是`UIUserInterfaceIdiomPad`，如果是iPhone等设备，则返回的是`UIUserInterfaceIdiomPhone`。我不知道在iWatch上运行，会不会返回`UIUserInterfaceIdiomWatch`（^-^)。通用的条件判断代码为：

    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) 
    {
        // Place iPhone/iPod specific code here...
    } else {
        // Place iPad-specific code here...
    }
    
我们继续。给button创建一个链接，对应的action为play。记得将iPhone和iPad两个版本的按钮都连接到同一个action。代码如：

    - (IBAction)play:(id)sender {
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone) {
            UIAlertView *playAlert = [[UIAlertView alloc] initWithTitle:@"Game on iPhone" message:@"Start Playing..." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
            [playAlert show];
        } else {
            UIAlertView *playAlert = [[UIAlertView alloc] initWithTitle:@"Game on iPad" message:@"Just ended..." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
            [playAlert show];
        }
    }

Demo很简单，但总归体验了如何兼容多种设备的方案。

###使用xib来创建UI

前面提到了用storyboard和xib都可以创建UI，现在，我们就来试试用xib来实现我们的UI。在这里，我们要将创建两个nib文件（分别为iPhone和iPad的UI）

**注意：通常，我们使用`~ipad`后缀来标识ipad的资源文件**

创建nib的我就详细赘述来，核心部分是通过检测设备类型来载入不同的nib：

    + (id) loadFromXib {
        NSString *xibName = NSStringFromClass(self);
        if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
            //oc做个字符串加法都这么麻烦
            xibName = [xibName stringByAppendingString:@"~ipad"];
        }
        return [self loadFromXibNamed:xibName];
    }

###闪屏、图标和图片资源

和两天UI布局相比，图片需要的版本就更多了，首先它有两个维度的区分：分辨率和屏幕尺寸。分辨率有高低之分，屏幕尺寸就多了（自动iPhone6开始就泛滥了）：3.7寸，4寸，4.4寸，5寸（还不知道iPhone7的size会怎样）。如此一排列组合，开发者要准备的资源就多得多了。

比如闪屏，我们就要准备这些尺寸的资源：

- 低分辨率的iPhone版本（320x480）
- 高分辨率的iPhone4,4s（640x960）
- 高分辨率的iPhone5,5s（640x1136）
- 低分辨率的iPad（1024*768）
- 高分辨率的iPad（2048*1536）

XCode 5引入来Asset Catalogs来管理图片资源。在项目导航中点击`images.xcassets`进入资源管理，将对应尺寸的图片拖入到指定的框框中即可。前面已经有实战过，就不再赘述了。

App的图标也和闪屏的管理方式一样。这里列举下相关的尺寸：

- 非retina的iPhone：57x57 、60x60 (iOS7)
- retina的iPhone：114x114 、120x120 (iOS7)
- 非retina的iPad：72x72 、76x76 (iOS7)
- retina的iPad：144x144 、156x156 (iOS7)

其他图片资源，只需要在图片文件名后面添加`@2x`后缀，我们不需要手动为retina屏幕指定文件名，iOS会自动根据屏幕类型来加载对应的图片。

###小结

创建一个通用的App的主要方式：

- 创建两个版本UI(可以使用sb和nib来创建UI）
- 两个UI可以使用同一个vc，也可以各自为政，视项目复杂度来决定
- 按照指定的方式准备多套图片资源
