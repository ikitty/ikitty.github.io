---
layout: post
title: "iOS练习-UIPageViewController"
description: "最近休假了一周，回来时都感觉掉了状态。赶紧写两行Code找点状态加满Buff继续。这几天练习了UIPageViewController，根据名字就能猜个大概意思吧。Apple的命名虽然臃肿，习惯了还真是感觉不错。当用户第一次打开某个App时，可能会看到一个类似“轮播广告”的教程，以帮助用户快速了解到App的特性。这是一个很棒的体验。iOS内置的UIPageViewController就能帮你实现这个效果。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

最近休假了一周，回来时都感觉掉了状态。赶紧写两行Code找点状态加满Buff继续。这几天练习了UIPageViewController，根据名字就能猜个大概意思吧。Apple的命名虽然臃肿，习惯了还真是感觉不错。当用户第一次打开某个App时，可能会看到一个类似“轮播广告”的教程，以帮助用户快速了解到App的特性。这是一个很棒的体验。iOS内置的UIPageViewController就能帮你实现这个效果。

###准备工作

新建一个singleViewApp，为什么不用page-based App模板呢？page-based包含了太多我们用不到的代码，为了快速体会UIPageViewController，我们还是从简单开始。创建的时候不要选择“使用storyboard”（新的xCode版本根本就没这个选项）

新建一个UIViewController的子类——`APPChildViewController`，勾上自动创建对应的xib文件。选择我们刚创建的xib文件，修改下背景色以便我们能更好的贯彻，并拖入一个label用于展示一些简单的文字。记得给label建立连接。APPChildViewController头文件的代码如：

    #import <UIKit/UIKit.h>
    
    @interface APPChildViewController : UIViewController
    
    //保存当前帧的索引
    @property (assign, nonatomic) NSInteger index;
    @property (strong, nonatomic) IBOutlet UILabel *screenNumber;
    
    @end
    
当每个子页面渲染的时候，我们要动态去更新label中的文字，所以要在`viewDidLoad`方法中加入下面的代码：

    self.screenNumber.text = [NSString stringWithFormat:@"Screen #%d", self.index];

###处理ViewController

UIPageViewController体现了ViewController和Container Controller的差别，container controlle管理着多个ViewController，并控制着他们的切换。而UIPageViewController就相当于于一个ContainerController。它能让用户在多个内容 (子页面) 之间切换。为了使用UIPageViewController，我们要采用`UIPageViewControllerDataSource`协议，通过实现这个协议来告诉每页该展示的内容。

打开AppViewController的头文件，申明协议和一些变量：

    #import <UIKit/UIKit.h>
    
    @interface APPViewController : UIViewController <UIPageViewControllerDataSource>
    
    @property (strong, nonatomic) UIPageViewController *pageController;
    
    @end
    
采用这个协议后，就需要实现下面的两个方法：

- `viewControllerAfterViewController`，提供当前ViewController后面的ViewController，也就是说下一屏的内容
- `viewControllerBeforeViewController`，不解释了。

让我们来实现这两个方法, 代码很直观，注意边界检查就好。

    - (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(UIViewController *)viewController {
        NSUInteger index = [(APPChildViewController *)viewController index];
        if (index == 0) {
            return nil;
        }
        index--;
        return [self viewControllerAtIndex:index];
        //写到这里xcode会报错的，因为我们还没实现自定义的viewControllerAtIndex方法,xCode是猴急了点儿
    }
    - (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(UIViewController *)viewController {
        NSUInteger index = [(APPChildViewController *)viewController index];
        index++;
        if (index == 5) {
            return nil;
        }
        return [self viewControllerAtIndex:index];
    }

###给UIPageViewController创建ViewController(子页面)

创建ViewController有两种方式，可以一次性全部创建好放入ContainerController中，但不建议用这种方式，太耗资源。另外的方式就是按需创建，代码中的`viewContrllerAtIndex`就是用来做这个事情的。它可以接受index参数，并创建对应的ViewController。

    //记得在头文件中引入前面新建的APPChildViewController.h
    - (APPChildViewController *)viewControllerAtIndex:(NSUInteger)index {
        APPChildViewController *childViewController = [[APPChildViewController alloc] initWithNibName:@"APPChildViewController" bundle:nil];
        childViewController.index = index;
        return childViewController;
    }

> TIPS:根据SO的评论观点，这里用initWithNibName来初始化，是不太合适的，因为它把实现细节暴露出来了，破坏了封装性。建议在APPChildViewController内部去实现方法。
    
另外，我们还要告诉iOS总页面和默认选中的项目：

    - (NSInteger)presentationCountForPageViewController:(UIPageViewController *)pageViewController {
        // The number of items reflected in the page indicator.
        return 5;
    }
    - (NSInteger)presentationIndexForPageViewController:(UIPageViewController *)pageViewController {
        // The selected item reflected in the page indicator.
        return 0;
    }

###初始化UIPageViewController

最后一步了

在主ViewController的m文件中加入如下代码：

    - (void)viewDidLoad {
        [super viewDidLoad];
        
        self.pageController = [[UIPageViewController alloc] initWithTransitionStyle:UIPageViewControllerTransitionStyleScroll navigationOrientation:UIPageViewControllerNavigationOrientationHorizontal options:nil];
        
        self.pageController.dataSource = self;
        [[self.pageController view] setFrame:[[self view] bounds]];
        
        APPChildViewController *initialViewController = [self viewControllerAtIndex:0];
        
        NSArray *viewControllers = [NSArray arrayWithObject:initialViewController];
        
        [self.pageController setViewControllers:viewControllers direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
        
        [self addChildViewController:self.pageController];
        [[self view] addSubview:[self.pageController view]];
        [self.pageController didMoveToParentViewController:self];
    }

相关解释：

- 初始化后，设定过渡的样式和方向（页面数量-小圆点只在水平scroll过渡时才会显示）。
- 数据源也就是当前类
- 设定Frame为当前view的大小，以保证全屏显示
- 创建第一个子级ViewController，并将其加入到一个数组
- 用新的ViewController替换当前的ViewController，并将page controller view添加到当前view

