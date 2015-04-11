---
layout: post
title: "iOS练习-本地通知"
description: "在iOS中，只能有一个应用在“前台”运行（用户只能看到一个APP），这种情况下，通知系统就非常重要，它能保证用户在没开启应用（或应用在后台运行）时也能收到相关的通知。它变相提供了一个多任务的支持方法。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

在iOS中，只能有一个应用在“前台”运行（用户只能看到一个APP），这种情况下，通知系统就非常重要，它能保证用户在没开启应用（或应用在后台运行）时也能收到相关的通知。它变相提供了一个多任务的支持方法。

###通过一个todoApp来体验本地通知

这个应用允许用户添加一些指定时间的时间提醒，当到达预定时间时，本地通知就会给用户一个提醒。

创建一个单页App，删除默认的ViewController，加入一个navigation controller，调整navigation item的title为todoList，并在其中加入一个bar button item，设置其identifier为add。

新增一个ViewController（detailViewController），加入一个Navigation bar（会自动包含一个navigation item），在那vigation item中加入两个按钮，cancel和save。给这个ViewController中加入两个label、一个文本输入框和一个DatePicker，大致效果如：

    //[cancel]   [save]
    //[label]    [textInput]
    //[label]    [DatePicker](时间选择组件)

回到，todoListViewController，将添加按钮和detailViewController连接起来。segue的类型选择modal。（如果选择push，会自动新增一个navigation item）

新建UIViewController的子类DetailViewController，并关联给detail视图，新建UITableViewController的子类ListTableViewController，关联给list视图。

打开助手编辑器，将detail视图中的四个控件进行链接，其中名称和时间是IBOutlet类型，cancel和save按你是IBAction类型，链接后的代码为：

    @property (weak, nonatomic) IBOutlet UITextField *itemText;
    @property (weak, nonatomic) IBOutlet UIDatePicker *dataPicker;
    - (IBAction)cancelBtn:(id)sender;
    - (IBAction)saveBtn:(id)sender;

有个小问题，打开助手编辑器，自动打开的源文件，而不是头文件。

处理cancel事件

    - (IBAction)cancelBtn:(id)sender {
        [self dismissViewControllerAnimated:YES completion:nil];
    }

###一探本地通知

为了保证用户输入信息点击return能关闭键盘，我们要实现键盘关闭的方法，在detail的源文件中加入：

    - (BOOL)textFieldShouldReturn:(UITextField *)textField
    {
        [self.itemName resignFirstResponder];
        return NO;
    }
并在viewDidLoad中加入：

    self.itemName.delegate = self;



我们对detailViewController进行一些调整。detail页面允许用户添加一个todo，并通过datePicker来选择一个时间。当点击save按钮时，我们会执行AddToDoViewController方法。

`save`method如下：

    - (IBAction)saveBtn:(id)sender {
        //首先要收起键盘
        [self.itemText resignFirstResponder];
        // Get the current date
        NSDate *pickerDate = [self.datePicker date];
        // Schedule the notification
        UILocalNotification* localNotification = [[UILocalNotification alloc] init];
        localNotification.fireDate = pickerDate;
        localNotification.alertBody = self.itemText.text;
        localNotification.alertAction = @"Show me the item";
        localNotification.timeZone = [NSTimeZone defaultTimeZone];
        localNotification.applicationIconBadgeNumber = [[UIApplication sharedApplication] applicationIconBadgeNumber] + 1;
        [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];
        // Request to reload table view data
        [[NSNotificationCenter defaultCenter] postNotificationName:@"reloadData" object:self];
        // Dismiss the view controller
        [self dismissViewControllerAnimated:YES completion:nil];
    }

代码很直观，就是配置notification，然后发起reloadData的请求，并隐藏当前controller（回到上一个视图）。    
Tips：如果你真的全部按教程来，你就会调到坑里了，哈哈。还好我又从坑里爬出来了。下面来填坑。

注意上面的`[[NSNotificationCenter defaultCenter] postNotificationName:@"reloadData" object:self];`,这个语句会发起一个通知请求（名称是reloadData），然后我们还得手动监听通知中心的请求，进而执行对应的方法。所以，我们要在列表的源文件的`viewDidLoad`方法中加入下面的代码：

    //监听通知中心的事件
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reloadTable) name:@"reloadData" object:nil];
    
上面的代码很直观，当监听到self的reloadData请求，去执行reloadTable，所以我们还要继续定义reloadTable：

    - (void)reloadTable{
        NSLog(@"run reload table");
        [self.tableView reloadData];
    }

补完上面的坑后，当你点击保存后，才能正确的刷新列表页面的通知。
    
###展示本地通知列表

回到list视图，选择TViewController cell，在属性窗口将其style改为subtitle。

在主界面中，我们展示了预订的通知列表，获取本地通知列表是很方便的，回到主视图的源文件中，我们来实现通知列表：

    - (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
    {
        // Return the number of sections.
        return 1;
    }
    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
    {
        // Return the number of rows in the section.
        return [[[UIApplication sharedApplication] scheduledLocalNotifications] count];
    }

前面两步分别实现表格区域数量和单个区域表格行数，接下来实现每行的内容：

    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        static NSString *CellIdentifier = @"Cell";
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
        // Get list of local notifications
        NSArray *localNotifications = [[UIApplication sharedApplication] scheduledLocalNotifications];
        UILocalNotification *localNotification = [localNotifications objectAtIndex:indexPath.row];
        // Display notification info
        [cell.textLabel setText:localNotification.alertBody];
        [cell.detailTextLabel setText:[localNotification.fireDate description]];
        return cell;
    }

此时，运行App，点击右上角的添加按钮，添加一个todo事项，并设定好时间。点击save。在到达预订时间时，你就能看到一个通知提醒。

###处理通知事件

如果app没有运行，用户看到的情况取决于通知的设置：

- 是否显示一个banner
- 在app图标上显示一个标志
- 播放一个声音

当用户点击通知时，会启动这个app。AppDelegate源文件中的`application:didFinishLaunchingWithOptions`方法将会被触发。

    - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
    {
        //这里只有点击通知才启动应用才会执行
        UILocalNotification *locationNotification = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
        if (locationNotification) {
            application.applicationIconBadgeNumber = 0;
        }
        return YES;
    }


如果app正在运行时，通知到达了，那么不会在屏幕提醒，会触发AppDelegate源文件中的`application:didReceiveLocalNotification`事件。我们添加下面的代码：

    - (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification
    {
        UIApplicationState state = [application applicationState];
        if (state == UIApplicationStateActive) {
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Reminder"
                                                           message:notification.alertBody
                                                           delegate:self cancelButtonTitle:@"OK"
                                                           otherButtonTitles:nil];
            [alert show];
        }
        // Request to reload table view data
        [[NSNotificationCenter defaultCenter] postNotificationName:@"reloadData" object:self];
        application.applicationIconBadgeNumber = 0;
    }

当app在后台运行时，`didReceiveLocalNotification`也能被触发。所以我们在上面的代码中先检测app的状态。然后我们也通知TV重新渲染数据，并重设app的图标状态。

####app在后端运行

app在后端运行时收到通知时，一般情况下，用户会在看到一个通知banner。点击这个banner时，会run起这个app。
