---
layout: post
title: "iOS-Block在actionSheet中的实践"
description:
"前段时间为Block折腾了一些时间，了解概念后就立马结合实例来加深理解了。如果你使用过action sheet，你肯定知道，我们需要遵循UIActionSheetDelegate 协议，还必须实现委托的方法，比如actionSheet:clickedButtonAtIndex:。我们要的是自定义一个类，结合回调函数来实现UIActionSheet 。如果你想知道用户点击了哪个按钮，常规的方法是在每个地方都写一次代码来处理。但这样并不优雅，我们可以使用Block作为Completion Handler更好的处理。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

前段时间为Block折腾了一些时间，了解概念后就立马结合实例来加深理解了。如果你使用过action sheet，你肯定知道，我们需要遵循`UIActionSheetDelegate` 协议，还必须实现委托的方法，比如`actionSheet:clickedButtonAtIndex:`。我们要的是自定义一个类，结合回调函数来实现`UIActionSheet `。如果你想知道用户点击了哪个按钮，常规的方法是在每个地方都写一次代码来处理。但这样并不优雅，我们可以使用Block作为Completion Handler更好的处理。

###开始练习

首先，CMD + N创建一个NSObject的子类为`CustomActionSheet`，在这个类中，我们将处理所有的常规action。也就是说，我们要遵循UIActionSheet 协议，并实现`actionSheet:clickedButtonAtIndex: `方法。或者其他必要的方法。重要的是我们只需要实现一次。因为我们方便的通过Completion Handler来处理action列表中的回调。

打开`CustomActionSheet.h`文件，声明初始化方法：

    @interface CustomActionSheet : NSObject 
    -(id)initWithTitle:(NSString *)title delegate:(id)delegate cancelButtonTitle:(NSString *)cancelButtonTitle destructiveButtonTitle:(NSString *)destructiveButtonTitle otherButtonTitles:(NSString *)otherButtonTitles, ...;
    @end

再声明用于展示action列表的方法：

    @interface CustomActionSheet : NSObject 
    ...
    //这里的withCompletionHandler方法名是可以自定义的
    -(void)showInView:(UIView *)view withCompletionHandler:(void(^)(NSString *buttonTitle, NSInteger buttonIndex))handler;
    @end

常规情况下，当调用`showInView`方法时，action sheet应该展示在view中。但在我们的案例中，我们在后面额外增加一个handler参数。并给其传递了两个参数。当我们再次需要处理action sheet的时候不需要再次写委托的代码了。

然后在源文件的私有区域中申明两个属性：

    @interface CustomActionSheet()
    @property (nonatomic, strong) UIActionSheet *actionSheet;
    @property (nonatomic, strong) void(^completionHandler)(NSString *, NSInteger);
    @end

接下来，初始化是action sheet：

    -(id)initWithTitle:(NSString *)title delegate:(id)delegate cancelButtonTitle:(NSString *)cancelButtonTitle destructiveButtonTitle:(NSString *)destructiveButtonTitle otherButtonTitles:(NSString *)otherButtonTitles, ...  {
        self = [super init];
        if (self) {
            _actionSheet = [[UIActionSheet alloc] initWithTitle:title
                                                       delegate:self
                                              cancelButtonTitle:nil
                                         destructiveButtonTitle:destructiveButtonTitle
                                              otherButtonTitles:nil];

            va_list arguments;
            va_start(arguments, otherButtonTitles);
            NSString *currentButtonTitle = otherButtonTitles;
            while (currentButtonTitle != nil) {
                [_actionSheet addButtonWithTitle:currentButtonTitle];
                currentButtonTitle = va_arg(arguments, NSString *);
            }
            va_end(arguments);

            [_actionSheet addButtonWithTitle:cancelButtonTitle];
            [_actionSheet setCancelButtonIndex:_actionSheet.numberOfButtons - 1];
        }
        return self;
    }

上面的代码可能比较陌生和晦涩，一步步来解释。

    _actionSheet = [[UIActionSheet alloc] initWithTitle:title
                                                   delegate:self
                                          cancelButtonTitle:nil
                                     destructiveButtonTitle:destructiveButtonTitle
                                          otherButtonTitles:nil];

注意，我们初始化action sheets的时候，并没有给cancelButton和otherButton传递标题。因为otherButton在初始化的时候实际是传入的一个列表对象，需要特殊对待。而cancelButton也是最后被添加的一个按钮。

继续往下看，下面的代码确实是第一次见面。

    va_list arguments;
    va_start(arguments, otherButtonTitles);
    NSString *currentButtonTitle = otherButtonTitles;
    while (currentButtonTitle != nil) {
        [_actionSheet addButtonWithTitle:currentButtonTitle];
        currentButtonTitle = va_arg(arguments, NSString *);
    }
    va_end(arguments);

在初始化中，所有的title都是以nil的形式存在的，因为多个title是以list的形式传递进来，所以我们需要逐个遍历参数来设置标题。下面就来逐个了解这些`va_XXX`的用途：

- `va_list`，包含多个对象的一个指针（通常叫做arguments）
- `va_start`，初始化`va_list`指针，并将其指向第一个参数
- `va_arg`，指向下一个参数，该方法的第二个参数是每个参数的类型，这也该方法才能分配对应的内存空间
- `va_end`，释放所有访问list的内存和所有参数。

上面的几个方法是C语言中的，不是OC的。重要的是我们通过这个方法来逐个设置标题。最后，我们还要去添加cancel按钮：

    [_actionSheet addButtonWithTitle:cancelButtonTitle];
    //告诉action sheet ，cancelBtn的位置用于区别其他按钮
    [_actionSheet setCancelButtonIndex:_actionSheet.numberOfButtons - 1];

虽然上面的代码看起来不那么直观，但这却是我们添加多个button title的唯一方法。如果在初始化时手动添加其他button，那么actionSheet最终只会展示一个button。因为它认为你添加的是单个button，而不是一个列表。接下来，我们来实现`showInView:withCompletionHandler:`方法：

    -(void)showInView:(UIView *)view withCompletionHandler:(void (^)(NSString *, int))handler{
        //注意这里的回调本没有立即直接，而是保存到其他变量中，然后在需要的时候才调用
        _completionHandler = handler;
        [_actionSheet showInView:view];
    }

注意这里的`_completionHandler`变量，根据apple编程规范，如果声明的property没有设置synthesize，那么系统会自动给你声明一个下划线开头的实例变量。

接着实现actionSheet协议中的必要方法，将action sheet展示在屏幕上：

    -(void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex{
        NSString *buttonTitle = [_actionSheet buttonTitleAtIndex:buttonIndex];
        //回调在这里才执行
        _completionHandler(buttonTitle, buttonIndex);
    }



首先我们将button的title保存到变量中，并将title和索引值按照预定的顺讯传递给completionHandler。

到此为止，我们的自定义类已经准备好。现在我们可以展示一个action sheet，并使用completion handler来处理对应的交互了。在界面中添加一个UIButton，在头文件中定义展示啊ctionsheet的方法：

    @interface ViewController : UIViewController
    - (IBAction)showActionSheet:(id)sender;
    @end

将UIbutton和刚定义的方法链接起来。打开vc的源文件，引入我们自定义的类，并创建一个customActionSheet的变量。

    #import "CustomActionSheet.h"
    @interface ViewController ()
    ...
    @property (nonatomic, strong) CustomActionSheet *customActionSheet;
    @end

然后我们来实现showActionSheet方法，首先来初始化customActionSheet

    - (IBAction)showActionSheet:(id)sender {
        CustomActionSheet *customActionSheet = [[CustomActionSheet alloc] initWithTitle:@"AppCoda"
                                                                           delegate:nil
                                                                  cancelButtonTitle:@"Cancel"
                                                             destructiveButtonTitle:nil
                                                                  otherButtonTitles:@"Option 1", @"Option 2", @"Option 3", nil];
        [_customActionSheet showInView:self.view withCompletionHandler:^(NSString *buttonTitle, NSInteger buttonIndex) {
            NSLog(@"You tapped the button in index: %d", buttonIndex);
            NSLog(@"Your selection is: %@", buttonTitle);
        }];
    }

至此，一个actionsheet的demo已经完成，CMD + R来测试效果把。

###block和多线程

block在多线程编程时也是非常有用的。开发者可以在其他线程中异步运行block代码。

说起多线程编程不得不说Grand Central Dispath（GCD），GCD是Apple开发中多线程编程的解决方案。他可以解决很多如数据锁定等异步编程的问题。下面列举一些基本使用方法：

    //申明一个队列
    dispath_queue_t myQueue = dispath_queue_create("queueName", NULL);
    //执行一个队列
    dispath_async(myQueue, ^{ [self doSth];});
    //如果不需要保留队列标识，也可以直接执行匿名队列
    dispath_async(dispath_queue_create("queueName", NULL), ^{[self doSth];});
    
在异步执行队列中(仅在异步时有效)，还可以暂停和恢复列队的执行，如：

    dispath_suspend(myQueue);
    dispath_resume(myQueue);

有些操作无法在异步队列中执行，比如UI绘制和NSNotifacationCenter的调用，队列也能从主线程执行代码（同步）：：

    dispath_sync(dispath_get_main_queue(), ^{[self doSth];});
