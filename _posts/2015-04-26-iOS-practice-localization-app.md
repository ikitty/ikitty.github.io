---
layout: post
title: "iOS练习-本地化你的应用"
description: "四月的下旬比较忙，但自己依然完成了对自我的挑战——同一时间段内完成多个重要的事情，对自己还算是满意的。当然人的精力总是有限，所以这两周，我只有周末才有空学习和更新心得。今天的练习是本地化App，非常简单，但依然记录下来，保持好的习惯不容易。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

四月的下旬比较忙，但自己依然完成了对自我的挑战——同一时间段内完成多个重要的事情，对自己还算是满意的。当然人的精力总是有限，所以这两周，我只有周末才有空学习和更新心得。今天的练习是本地化App，非常简单，但依然记录下来，保持好的习惯不容易。

为了让不同地区使用各种语言的用户都能完美的体验我们的App，我们需要做一个本地化的工作来支持这种特性。开发者可以通过XCode和一些API很方便的实现本地化的特性。

本地化可不是简单的翻译。它还包含其他的元素，比如视频、图像、语音等。以及各种数字的显示格式。

###概览

我们将通过一个简单的图书展示来体验本地化的过程。图书的包含内容、图片。原始语音是英语，我们要为它制作一个中文版本。要本地化的内容有：

- 文本内容
- 图片
- App名称
- 动态展示的信息

当用户设置系统语言（General > International > Language）的时候，App会根据实际的语言来请求对应的本地化资源。

###开始

新建一个SingleApp，将默认的ViewController嵌入到navigation中。然后加入这些控件：

- 一个UILabel作为标题
- 一个UILabel作为内容
- 一个UIImage作为配图
- 一个UIButton作为购买按钮

###本地化

在导航栏点击我们的App名称，选中项目名称，在右侧的info菜单中，选中`Use Base Internationalization`，然后你将会看到一个弹窗让你为base Internationalization选择storyboard ，然后点击Finish按钮。

Xcode 4.5首次引入了base internationalization。App要为默认的语言设置好Storyboad。稍后我们创建一个“本地化”的东西，XCode会自动生成一个包含storyboard中所有文本的文件。

> 在XCode4.5之前还没有base internationalizaiton这个概念，如果要兼容五种语言，那么开发者需要copy五份storyboard，如果要修改某个细节，也要修改五份。坑了把。所以，有了base Internalization就不用那么坑了。

**注意：Xcode5.1开始，会默认启用base internationlization，所以上面的步骤都可以省略掉**

现在，我们来实现中文版本本地化，首先选中ViewController，然后点击导航栏的项目，在project的info栏目下，点击localization下方的+按钮，在弹窗中选择“Chinese ”。

然后在接下来的创建中文本地化的窗口中，将所有资源文件选中，并点击完成按钮。你在localization区域发现多了一个中文版了。

疑问：既然是为中文版创建的本地化，为何弹出的infoplist是for english的呢？而且无法更改。但点击完成之后，又显示的是中文版本的。

这时，你会发现storyboard前面多了个三角符号，展开后，你会看到多了一个中文版本的StoryBoard.strings。这个文件内容是包含了StoryBoard中的文本（以key/value的形式存储）

    /* Class = "IBUILabel"; text = "test"; ObjectID = "0N3-up-Ts6"; */
    "0N3-up-Ts6.text" = "test";

当我们添加一个本地化后，XCode会自动扫描StoryBoard，将其中的的文本内容提到到一个strings文件中。在strings文件中，第一部分是对象的id，这个id在Identifier栏中能找到。当生成好strings文件后，我们的主要工作就是翻译了。将对应的文本翻译成本地化的语言就好。比如：

    "0N3-up-Ts6.text" = "测试";

静态文本的本地化工作就已经完成了，按下CMD + R 来体验下吧。

###本地化图片

在XCode中本地化图片是很方便的。选中相关图片，切换到file栏，并定位到本地化选项，你会看到一个`localize...`的按钮。点击这个按钮进行配置。选择base，并确认。

然后你将会在本地化选项中看到一个中文版的选项，选择中文本地化，你将会发现两个版本的图片（中英文版本）。

在finder中打开项目的文件夹，你会发现两个文件夹，en.lproj和ch.lproj。这都是由XCode为本地化而自动创建的。你会发现每个文件夹里面都包含了一个图片。我们用一个中文版的图片覆盖原有中文版文件夹下面的图片。

运行App，并切换系统语言来测试下。

###本地化动态内容

上面我们为静态资源进行了本地化，但实际场景中，还有部分动态生成的内容也需要我们去本地化。

我们以点击某个按钮后的弹层来实践：

    //点击按钮后执行弹出层
    - (IBAction)buy:(id)sender
    {
        [[[UIAlertView alloc] initWithTitle:@"Confirmation"
                                    message:NSLocalizedString(@"BOOK_PURCHASE", @"Message")
                                   delegate:nil
                          cancelButtonTitle:@"OK"
                          otherButtonTitles:nil] show];
    }

这里我们使用`NSLocalizedString`来动态从Localizable.strings文件中获取数据，它的第一个参数是key，通过这个key来插叙你要的数据，第二个参数是comment，仅供自己参考。

我们还需要创建从Localizable.strings文件中。按下CMD+N创建一个strings File，并保存为Localizable.strings.

和上面一样，我们继续来本地化刚建立的文件。选中Localizable.strings文件，点击文件栏中的Localize...按钮。在弹出的对话框中，选择Base，点击Localize按钮。然后z再选中中文选项来为中文添加一个本地化。正常情况下，此时，你应该能看到两个版本的Localizable.strings文件了。

在基础版本的string文件中添加：

    //for english version
    "BOOK_PURCHASE" = "Thanks for the Purchase!";
    
在中文版本的string文件中添加：

    //for Ch
    "BOOK_PURCHASE" = "感谢购买!";
    
###本地化App名称

当我们创建中文本地化的时候，Xcode会自动为中文版本创建一个infoPlist.strings文件。我们可以自行修改里面的key/value。

为了修改App的本地化名称，我们需要在infoPlist.strings文件中添加一行：

    "CFBundleDisplayName" = "图书";

CMD + R来预览下吧。如果没有生效，尝试Clean一下，再build。
