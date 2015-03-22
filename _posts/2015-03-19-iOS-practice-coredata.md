---
layout: post
title: "iOS练习-CoreData"
description: "CoreData不是数据库，它是一个框架，帮助你方便出对数据进行CRUD操作，即使你不懂SQL语句也没关系。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

CoreData不是数据库，它是一个框架，帮助你方便出对数据进行CRUD操作，即使你不懂SQL语句也没关系。

###实践

创建一个EmptyApp，选择使用“coreData”。

###关于CoreData stack

coreData stack主要包含这几部分：

- ManagedObjectModel，描述数据结构
- Presistent store 持久化的东西
- coordinator，管理数据持久化的一个中间件？

ManagedObjectContext，管理数据存储和读取，像是操作数据的一个接口，是我们接触得最多的部分。

###设计ManagedObjectModel

选择coreData.xcdatamodeld ,然后点击底部的“add entity”添加一个实体。然后在arrtibutes区块，点击加号，来新增几个属性。

###设计接口

新建一个Storyboard（在interface下面），在通过设置中将刚才创建的storyboard设置为主要接口。

删除方法
`- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`中所有代码，保留`return yes`


拖入TV，插入到导航中，并拖入一个button，选中这个button，并将id修改为add，此时这个按钮会变成“+”

选择cell，将style改为"right detail".

拖入一个ViewController，并在顶部添加一个nav bar，添加两个button和两个textFiled。并按住ctrl，将添加按钮拖向detail，选择modal作为segue的action。

###创建ViewController的类

第一个class基于UITableViewController，第二个基础于UIViewController，分别指派给对应的视图。并设置变量，然后连接好变量。

    @interface DetailViewController : UIViewController
    @property (weak, nonatomic) IBOutlet UITextField *name;
    @property (weak, nonatomic) IBOutlet UITextField *sex;


    - (IBAction)save:(id)sender;
    - (IBAction)cancel:(id)sender;


###保存数据

初始化managedObjectContext.

    - (NSManagedObjectContext *)managedObjectContext {
        NSManagedObjectContext *context = nil;
        id delegate = [[UIApplication sharedApplication] delegate];
        if ([delegate performSelector:@selector(managedObjectContext)]) {
            context = [delegate managedObjectContext];
        }
        return context;
    }

实现按钮的`cancel`方法：

    - (IBAction)cancel:(id)sender {
        [self dismissViewControllerAnimated:YES completion:nil];
    }

注意：传入变量的类型一定要和在entity中申明的类型一致，否则会报错，而且修改之后也会报错，一定要在模拟器中删除这个app，重新buildAndRun，才会正常。

    - (IBAction)save:(id)sender {
        NSManagedObjectContext *context = [self managedObjectContext];
        // Create a new managed object
        NSManagedObject *newDevice = [NSEntityDescription insertNewObjectForEntityForName:@"Device" inManagedObjectContext:context];
        [newDevice setValue:self.nameTextField.text forKey:@"name"];
        [newDevice setValue:self.versionTextField.text forKey:@"version"];
        NSError *error = nil;
        // Save the object to persistent store
        if (![context save:&error]) {
            NSLog(@"Can't Save! %@ %@", error, [error localizedDescription]);
        }

        [self dismissViewControllerAnimated:YES completion:nil];
    }


###获取数据

先定义一个可变数组，用于存储数据。

    @interface DeviceViewController ()
    @property (strong) NSMutableArray *devices;
    @end

还是先定义ManagedObjectContext，代码就不重复了。

    - (void)viewDidAppear:(BOOL)animated
    {
        [super viewDidAppear:animated];

        NSManagedObjectContext *managedObjectContext = [self managedObjectContext];
        NSFetchRequest *fetchRequest = [[NSFetchRequest alloc] initWithEntityName:@"Device"];
        self.devices = [[managedObjectContext executeFetchRequest:fetchRequest error:nil] mutableCopy];

        [self.tableView reloadData];
    }

小提示：`viewDidAppear` 方法会在每次view展示的时候调用，而`viewDidLoad`仅调用一次。


    - (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
    {
        return 1;
    }
    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
    {
        return self.devices.count;
    }

    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        static NSString *CellIdentifier = @"Cell";
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];

        NSManagedObject *device = [self.devices objectAtIndex:indexPath.row];
        [cell.textLabel setText:[NSString stringWithFormat:@"%@ %@", [device valueForKey:@"name"], [device valueForKey:@"version"]]];
        [cell.detailTextLabel setText:[device valueForKey:@"company"]];
        return cell;
    }

###删除数据

通过CoreData删除数据也很方便，只要实现canEditRowAtIndexPath和commitEditingStyle方法就可以了。

    - (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
    {
        // Return NO if you do not want the specified item to be editable.
        return YES;
    }
    - (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
    {
        NSManagedObjectContext *context = [self managedObjectContext];
        if (editingStyle == UITableViewCellEditingStyleDelete) {
            // Delete object from database
            [context deleteObject:[self.devices objectAtIndex:indexPath.row]];

            NSError *error = nil;
            if (![context save:&error]) {
                NSLog(@"Can't Delete! %@ %@", error, [error localizedDescription]);
                return;
            }

            // Remove device from table view
            [self.devices removeObjectAtIndex:indexPath.row];
            [self.tableView deleteRowsAtIndexPaths:[NSArray arrayWithObject:indexPath] withRowAnimation:UITableViewRowAnimationFade];
        }
    }

context提供了一个deleteObject方法允许你去删除指定的对象。

###CoreData更新数据

在tableCell和detail之间添加一个segue，当我们tap table cell时，引导用户去detail页面编辑数据。

    - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
    {
        if ([[segue identifier] isEqualToString:@"UpdateDevice"]) {
            NSManagedObject *selectedDevice = [self.devices objectAtIndex:[[self.tableView indexPathForSelectedRow] row]];
            DeviceDetailViewController *destViewController = segue.destinationViewController;
            destViewController.device = selectedDevice;
        }
    }
    
我们在detail文件中添加一个属性来保存选中的数据（同时添加synthesize）

    @property (strong) NSManagedObject *device;

我们再编辑viewDidLoad，保证能显示编辑之前的数据：

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        // Do any additional setup after loading the view.
        if (self.device) {
            [self.nameTextField setText:[self.device valueForKey:@"name"]];
            [self.versionTextField setText:[self.device valueForKey:@"version"]];
            [self.companyTextField setText:[self.device valueForKey:@"company"]];
        }
    }
    
接下来，我们还要对save方法进行调整，保证其能在编辑数据后更新数据到数据库。

    - (IBAction)save:(id)sender {
        NSManagedObjectContext *context = [self managedObjectContext];

        if (self.device) {
            // Update existing device
            [self.device setValue:self.nameTextField.text forKey:@"name"];
            [self.device setValue:self.versionTextField.text forKey:@"version"];
            [self.device setValue:self.companyTextField.text forKey:@"company"];
        } else {
            // Create a new device
            NSManagedObject *newDevice = [NSEntityDescription insertNewObjectForEntityForName:@"Device" inManagedObjectContext:context];
            [newDevice setValue:self.nameTextField.text forKey:@"name"];
            [newDevice setValue:self.versionTextField.text forKey:@"version"];
            [newDevice setValue:self.companyTextField.text forKey:@"company"];
        }

        NSError *error = nil;
        // Save the object to persistent store
        if (![context save:&error]) {
            NSLog(@"Can't Save! %@ %@", error, [error localizedDescription]);
        }
        [self dismissViewControllerAnimated:YES completion:nil];
    }

###查看SQL执行语句

当你需要debug的时候，可以通过查看SQL原始语句。

点击“模拟器”前面的项目名称，选择“edit scheme”，在“arguments passed on launch”区域，点击“+”，写入`-com.apple.CoreData.SQLDebug 1`。确认后，再次运行app的时候，就能看到对应SQL执行语句。

    
