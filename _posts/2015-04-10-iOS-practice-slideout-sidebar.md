---
layout: post
title: "iOS练习-SlideOut侧边栏"
description: "手机屏幕始终有限，如何在有限的展示空间提供便捷的导航入口呢？Facebook的App设计了一个可以从屏幕侧边滑出的导航，这一设计模式引得各大主流App尽享模仿。一时间，Path，Mailbox，Gmail都采用了这种设计。Github 上也有很多侧栏导航的解决方案，这里我们使用John的SWRevealViewController类来实现，这里就通过一个简单的demo来练习。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

手机屏幕始终有限，如何在有限的展示空间提供便捷的导航入口呢？Facebook的App设计了一个可以从屏幕侧边滑出的导航，这一设计模式引得各大主流App尽享模仿。一时间，Path，Mailbox，Gmail都采用了这种设计。Github 上也有很多侧栏导航的解决方案，这里我们使用John的`SWRevealViewController`类来实现，这里就通过一个简单的demo来练习。

###它的工作流程：

- 用户点击“list”按钮，导航向右滑出
- 用户再次点击“list”按钮，导航向左收起
- 通过左右滑动也能达到同样的效果

###开始

新建一个SingleViewApp，加入各种控件

- 加入三个navigation Controller，分别用于显示首页，地图和图片页面
- 加入一个tableVC，用于显示slidebar

###引入SWRevealVC

[github]: https://github.com/John-Lluch/SWRevealViewController

由于这是一个第三方库，所以先要从github上[download][github]回来，然后本地项目中新建一个文件夹，并将相关文件拖入到新文件夹中。

SWRevealVC是支持storyBoard的，开发者需要通过segue连接一个前端的VC和后端的VC，前端VC是默认的视图，后后端的VC就是用来展示侧边栏导航。通常都是用一个table来实现。

###建立连接

选中默认的VC，指派类为SWRevealVC。按住ctrl，将SWRevealVC拖向后端VC，在弹出框选中`reveal view controller set segue`，将segue的identifier修改为`to_rear`，用同样的步骤和前端VC建立连接。并将segue的identifier命名为`to_front`。

####前端-主视图

引入依赖

    #import "SWRevealViewController.h"

初始化

    SWRevealViewController *revealViewController = self.revealViewController;
    if ( revealViewController )
    {
        [self.sidebarButton setTarget: self.revealViewController];
        [self.sidebarButton setAction: @selector( revealToggle: )];
        [self.view addGestureRecognizer:self.revealViewController.panGestureRecognizer];
    }

revealToggle用来处理侧边栏的展示和隐藏，Cocas使用target-action机制来关联多个对象；最后一句支持手势操作。

###给导航添加项目

添加一些默认的导航，UI操作不赘述。我们回到侧边栏的m文件中：

    #import "SWRevealViewController.h"

新增变量用于存储导航数据

    @implementation SidebarViewController {
        NSArray *menuItems;
    }

在viewDidLoad中初始化数据：

    menuItems = @[@"title", @"news"];

实现table的相关方法：

    - (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
        // Return the number of sections.
        return 1;
    }
    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
        // Return the number of rows in the section.
        return menuItems.count;
    }
    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
        NSString *CellIdentifier = [menuItems objectAtIndex:indexPath.row];
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        return cell;
    }

###实现导航的选择

按住ctrl，将导航项目拖向对应页面所属的navigation controller，选择`reveal view controller push controller`。

当完成好所有链接后，我们打开侧边栏的源文件`SidebarVC.m`，添加一些代码来给每个子页面设置对应的标题。

    - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
        // Set the title of navigation bar by using the menu items
        NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        UINavigationController *destViewController = (UINavigationController*)segue.destinationViewController;
        destViewController.title = [[menuItems objectAtIndex:indexPath.row] capitalizedString];
    }

回顾整个例子，主要就是利用第三方库将子页面和侧边栏菜单链接一些链接，然后在触发菜单栏的时候传递一些数据即可完成。
