---
layout: post
title: "UIActionSheet简介和实践"
description: "前几周在看Block的时候就已经体验过ActionSheet了，但没做详细介绍，这次专门回来来看下ActionSheet的一些细节。大部分移动App都提供了可以和用户交互的功能。用户能在交互过程中做出一些选择或者决定。iOS SDK提供了一个预定制的操作选项控制器，这就是UIActionSheet。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

前几周在看Block的时候就已经体验过ActionSheet了，但没做详细介绍，这次专门回来来看下ActionSheet的一些细节。大部分移动App都提供了可以和用户交互的功能。用户能在交互过程中做出一些选择或者决定。iOS SDK提供了一个预定制的操作选项控制器，这就是UIActionSheet。

Action sheets是由一些用户可以选择的选项组成。它被广泛应用于许多App中。有个缺陷就是开发者不能控制它的表现，如果在自定义GUI的App使用它，就显示有点格格不入了。尽管如此，在可用性方面，真是不错的。

除了ActionSheet以外，还有一个iPad专业的UIPopoverController。它本质是一个在其他内容之上的用于展示一些内容的容器。比较特殊的是它可以出现在iPad屏幕的任意位置（就是webpage里面的绝对定位的popup容器一样）。不过一般是一个按钮同时出现的，iOS默认会把一个ActionSheet塞入UIPoperController中，不过，我们也可以自定义里面的内容。

ActionSheet可以包含三中类型的按钮，一种是高亮的按钮，一种是普通类型的按钮，另外一种是取消按钮。话说ActionSheet里面的内容可不能为空。接下来通过实例来理解。

###App概览

在实例中，主要展示如何去展示ac，去定义其中的内容并处理用户的操作。


###开始

创建一个SinlgeViewApp。我们先来看看如何展示一个ActionSheet。在storyBoard中加入三个按钮，分别是：normalAction, deleteAction和colorAction。并为他们连接连接（类型是IBAction），此时头文件为：

    @interface ViewController : UIViewController
    - (IBAction):showNormalAction(id)sender;
    - (IBAction)showDeleteConfirmation:(id)sender;
    - (IBAction)showColorsActionSheet:(id)sender;
    @end

在源文件中实现这些方法：

     - (IBAction)showNormalAction:(id)sender {
        UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:@"What do you want to do with the file?"
                                                                 delegate:self
                                                        cancelButtonTitle:@"Cancel"
                                                   destructiveButtonTitle:@"Delete it"
                                                        otherButtonTitles:@"Copy", @"Move", @"Duplicate", nil];
    }

title就是显示在ActionSheet最底部的描述；delegate是ActionSheet的委托，如果你不打算实现任何委托，你可以设置为nil，不然一般都会设置为self；destructive按钮是用高亮的颜色来展示的，一般用来表示高危操作，值得注意的是：这个按钮总是处于ActionSheet按钮列表的第一个位置。

###自定义ActionSheet的option

某些情况下，你可能需要自定义ActionSheet的选项。比如你有一个tableView包含了一些联系人，当用户删除某一行数据的时候，你可能可能需要一个删除确认框。现在，我们在源文件中实现第二个方法：

    - (IBAction)showDeleteConfirmation:(id)sender {
        UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:@"Really delete the selected contact?"
                                                                 delegate:self
                                                        cancelButtonTitle:@"No, I changed my mind"
                                                   destructiveButtonTitle:@"Yes, delete it"
                                                        otherButtonTitles:nil];
        [actionSheet showInView:self.view];
    }

CMD + R，当你点击delete按钮的时候，就会显示刚才定义的ActionSheet。接下来，让我们实现第三个按钮的aciton。在这个action中，我们不需要高亮按钮和取消按钮。代码如：

    - (IBAction)showColorsActionSheet:(id)sender {
        UIActionSheet *actionSheet = [[UIActionSheet alloc] initWithTitle:@"Pick a color:"
                                                                 delegate:self
                                                        cancelButtonTitle:nil
                                                   destructiveButtonTitle:nil
                                                        otherButtonTitles:@"Red", @"Green", @"Blue", @"Orange", @"Purple", nil];
        [actionSheet showInView:self.view];
    }

简单的ActionSheet就是这么简单。

###处理Actions

UIActionSheetDelegate协议提供了一些方法允许开发者处理用户的操作。我们从最简单的`actionSheet:clickedButtonAtIndex:`说起。因为页面中有三个button都可以触发ActionSheet，所以我们需要给他们逐个添加tag，这样我们在clickedButtonAtIndex事件中才能方便的区分他们。添加好tag之后，我们在源文件中实现click事件处理方法：

    -(void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex{
        if (actionSheet.tag == 100) {
            NSLog(@"The Normal action sheet.");
        }
        else if (actionSheet.tag == 200){
            NSLog(@"The Delete confirmation action sheet.");
        }
        else{
            NSLog(@"The Color selection action sheet.");
        }
        NSLog(@"Index = %d - Title = %@", buttonIndex, [actionSheet buttonTitleAtIndex:buttonIndex]);
    }

另外，我们还能对取消ActionSheet的事件进行监听处理，比如，当第三个按钮触发的ActionSheet取消时，会在控制台显示用户选中的颜色：

    -(void)actionSheet:(UIActionSheet *)actionSheet didDismissWithButtonIndex:(NSInteger)buttonIndex{
        if (actionSheet.tag == 300) {
            NSLog(@"From didDismissWithButtonIndex - Selected Color: %@", [actionSheet buttonTitleAtIndex:buttonIndex]);
        }
    }

当然还有其他的方法，比如`willDismissWithButtonIndex`，这里就不详细介绍了。需要使用的时候可以参考Xcode里面的文档就好。


