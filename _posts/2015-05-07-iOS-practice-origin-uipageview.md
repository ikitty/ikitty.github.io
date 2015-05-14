---
layout: post
title: "iOS练习-使用storyboard创建UIPageViewController"
description: "通用App是指能同时兼容iPhone, iTouch 和iPad设备的App（类似网页自动适配pc端和移动端），为了达到完美的用户体验，用户只需要下载一个版本的App，就能在多个设备上使用。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

之前学习了用InterfaceBuilder来创建UIPageViewController，今天我们尝试用storyboard来创建UIPageViewController。UIPageViewController的基本概念和可配置的选项我就不说了，上次的文章已经讲过了。我会侧重说一些使用storyboard和InterfaceBuilder创建UI的差异和要注意的点。

###开始

创建一个singleViewApp，向storyboard中加入一个pageViewController和一个ViewController。解释下几个ViewController的用途：

- 默认的ViewController管理page ViewController
- 新增的ViewController用来呈现page的内容

选中page ViewController，在右侧的属性栏给其分配一个storyboard id为`PageViewController`，再给放置内容的ViewController分配一个storyboard id为`PageContentController`，在稍后的代码，我们将会用到这些id。

我们将pageViewController的动画过渡方式调整为滚动（默认是翻页效果）。然后来设计内容页面。加入一个imageView和label。将它们调整到合适的位置。

回到默认的ViewController中，加入一个UIButton，修改内容为Start Again。

###创建ViewController类

CMD+N新建一个UIViewController的子类叫`PageContentViewController`，回到storyboard，将page content ViewController关联到刚建立的类。

为imageView和label建立链接为`backgroundImageView`和`titleLabel`。此时，对应的头文件应该是：

    #import <UIKit/UIKit.h>
    @interface PageContentViewController : UIViewController
    @property (weak, nonatomic) IBOutlet UIImageView *backgroundImageView;
    @property (weak, nonatomic) IBOutlet UILabel *titleLabel;
    @end

现在为start again按钮建立一个action名为`startWalkthrough`。

###内容页面的实现

打开`PageContentViewController.h`新增属性：

    @property NSUInteger pageIndex;
    @property NSString *titleText;
    @property NSString *imageFile;

然后打开对应的源文件，在`viewDidLoad`方法中初始化图片名称和标题。

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        self.backgroundImageView.image = [UIImage imageNamed:self.imageFile];
        self.titleLabel.text = self.titleText;
    }

###实现pageViewController

UIPageViewController是一个包含所有子页面的一个容器类，这个controller负责管理所有子页面的展示。要让UIPageViewController正常工作，我们得遵循`UIPageViewControllerDataSource`协议，这个dataSource负责按需提供对应的内容。在实现协议的过程中来决定该展示哪个页面。

在这个实例中，我们使用ViewController作为UIPageViewController的数据源，因为我们需要申明一个实现了`UIPageViewControllerDataSource`协议的ViewController类。ViewController类也负责提供子页面的数据，打开ViewController的头文件。添加一个变量用于控制UIPageViewController，和其他必要的属性。

    #import <UIKit/UIKit.h>
    #import "PageContentViewController.h"

    //新增协议
    @interface ViewController : UIViewController <UIPageViewControllerDataSource>

    - (IBAction)startWalkthrough:(id)sender;
    //便于控制uipageViewController
    @property (strong, nonatomic) UIPageViewController *pageViewController;
    @property (strong, nonatomic) NSArray *pageTitles;
    @property (strong, nonatomic) NSArray *pageImages;

    @end
    
再打开ViewController的源文件，初始化子页面的数据：

    - (void)viewDidLoad
    {
        [super viewDidLoad];
    
        _pageTitles = @[@"Over 200 Tips and Tricks", @"Discover Hidden Features", @"Bookmark Favorite Tip", @"Free Regular Update"];
        _pageImages = @[@"page1.png", @"page2.png", @"page3.png", @"page4.png"];
    }

接下来，我们要实现`UIPageViewControllerDataSource`协议中的两个方法`viewControllerAfterViewController`和`viewControllerBeforeViewController`，之前的文章已经解释过了，这里不再赘述：

    - (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerBeforeViewController:(UIViewController *)viewController
    {
        NSUInteger index = ((PageContentViewController*) viewController).pageIndex;
        
        if ((index == 0) || (index == NSNotFound)) {
            return nil;
        }
        
        index--;
        return [self viewControllerAtIndex:index];
    }
    
    - (UIViewController *)pageViewController:(UIPageViewController *)pageViewController viewControllerAfterViewController:(UIViewController *)viewController
    {
        NSUInteger index = ((PageContentViewController*) viewController).pageIndex;
        
        if (index == NSNotFound) {
            return nil;
        }
        
        index++;
        if (index == [self.pageTitles count]) {
            return nil;
        }
        return [self viewControllerAtIndex:index];
    }

页面左右切换的方法已经实现，我们还要实现一个关键的方法——按需展示特定页面：

    - (PageContentViewController *)viewControllerAtIndex:(NSUInteger)index
    {
        if (([self.pageTitles count] == 0) || (index >= [self.pageTitles count])) {
            return nil;
        }
        
        // Create a new view controller and pass suitable data.
        //新技能get：使用storyboard id来获取对应的UI控件，并实例化
        PageContentViewController *pageContentViewController = [self.storyboard instantiateViewControllerWithIdentifier:@"PageContentViewController"];
        pageContentViewController.imageFile = self.pageImages[index];
        pageContentViewController.titleText = self.pageTitles[index];
        pageContentViewController.pageIndex = index;
        
        return pageContentViewController;
    }

如果我们要展示表示状态的小圆点，我们还要实现两个方法：

    - (NSInteger)presentationCountForPageViewController:(UIPageViewController *)pageViewController
    {
        return [self.pageTitles count];
    }
    
    - (NSInteger)presentationIndexForPageViewController:(UIPageViewController *)pageViewController
    {
        return 0;
    }

###初始化UIPageViewController

最后的一步了，在ViewController的源文件加入：

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        // Create the data model
        _pageTitles = @[@"..."];
        _pageImages = @[@"x.jpg"];
        
        // Create page view controller
        //又一次晒出了storyboard id的使用
        self.pageViewController = [self.storyboard instantiateViewControllerWithIdentifier:@"PageViewController"];
        self.pageViewController.dataSource = self;
        
        PageContentViewController *startingViewController = [self viewControllerAtIndex:0];
        NSArray *viewControllers = @[startingViewController];
        [self.pageViewController setViewControllers:viewControllers direction:UIPageViewControllerNavigationDirectionForward animated:NO completion:nil];
        
        // Change the size of page view controller
        self.pageViewController.view.frame = CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height - 30);
        
        [self addChildViewController:_pageViewController];
        [self.view addSubview:_pageViewController.view];
        [self.pageViewController didMoveToParentViewController:self];
    
    }

很直观，不解释了。如果你想自定义状态小圆点的展示，可以打开appDeleagte.m文件，在`didFinishLaunchingWithOptions`方法中新增代码如下：

    UIPageControl *pageControl = [UIPageControl appearance];
    pageControl.pageIndicatorTintColor = [UIColor lightGrayColor];
    pageControl.currentPageIndicatorTintColor = [UIColor blackColor];
    pageControl.backgroundColor = [UIColor whiteColor];
    
喂，都到结尾部分了。说好的回到首页的功能呢。。不急马上来实现。回到ViewController的源文件，编辑如下：

    - (IBAction)startWalkthrough:(id)sender {
        PageContentViewController *startingViewController = [self viewControllerAtIndex:0];
        NSArray *viewControllers = @[startingViewController];
        [self.pageViewController setViewControllers:viewControllers direction:UIPageViewControllerNavigationDirectionReverse animated:NO completion:nil];
    }

就是把初始化中的部分重新执行了一次。
