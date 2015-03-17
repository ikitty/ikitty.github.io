---
layout: post
title: "iOS练习小结-简单的Table和自定义cell"
description: "最近基本都是在跟着教程去做些联系，顺便也小结下做过的练习。给自己长点记性。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

最近基本都是在跟着教程去做些练习，顺便也小结下做过的练习。给自己长点记性。IDE方面的操作步骤就不多做描述了，熟能生巧的东西。

新建一个singleApp应用，在右下角将tabieView中加入到storyboard。

###protocol

要在表格中展示数据，我们需要用到两个协议：UITableViewDelegate, UITableViewDataSource。我们先在头文件中加入这两个协议，如：

    //语法解释：SimpleTableViewController 是继承于 UIViewController
    @interface SimpleTableViewController : UIViewController <UITableViewDelegate, UITableViewDataSource>

`UITableViewDelegate` 和`UITableViewDataSource` 是OC中的协议，为了在tableView中展示数据，我们去实现协议中的方法即可。(当你在头文件中申明协议后，切换到m文件中，xcode会提示你去实现协议中必要的方法)。

uitableViewDataSource是展示数据的关键部分，它链接着数据和视图，他定义了两个必须实现的方法（tableView：cellForRowAtIndexPath ，tableView：numberOfRowsInSection），当我们实现了这两个方法，视图就知道要怎么展示了（比如多少行，每行内容是什么）

UITableViewDelegate，处理UITableView的表现，有些可选的方法，让你管理tableRow的高度等，配置table头尾等。

###implementation

首先在m文件中里面定义一个实例变量存储数据

    @implementation SimpleTableViewController
    //定义实例变量（记得这里要自己加一对大括号，然后在里面写变量 ）
    {
        //数量不固定的数组就用  NSMutableArray
        NSArray *tableData;
    }

变量声明的时候要在前面加类型描述; 如果是返回的时候，也要加类型，但格式不同：是把类型放在扩号里面,比如`- (void) method`，然后初始化数据：

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        //OC已经支持这种一目了然的语法糖定义了
        tableData = @[@"Alex", @"katarina"];
    }


####实现必要的方法

tableView:numberOfRowsInSection

    //返回的是一个整型，所以前面有写- (NSInteger)
    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
    {
        return [tableData count];
    }

tableView:cellForRowAtIndexPath

    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        //给cell指定一个ID
        static NSString *simpleTableIdentifier = @"cellID";

        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];

        if (cell == nil) {
            cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:simpleTableIdentifier];
        }

        cell.textLabel.text = tableData[indexPath.row];
        return cell;
    }

###connect DataSource and Delegate

关键的一步建立连接。回到storyboard，按住ctrl，选中tableView，在右侧的outlets窗口中，将dataSource和delegate拖向对应viewController即可。


###添加缩略图

将图片文件夹直接拖入项目中，或者右击项目，添加文件夹

在m文件中编辑cellForRowAtIndexPath：

    cell.imageView.image = [UIImage imageNamed:@"test.jpg"];

至今，可以按下Cmd+R来预览app了。我们的目标远不止此，我们继续来做一个个性化的cell。我们需要多几个数组来存储其他的数据:

    thumbnails = @[@"1.jpg", @"2.jpg", @"3.jpg"];
    prepTime = @[@"30s", @"60s", @"90s"];

###个性化cell

新建一个空文件（UI），命名为customCell，打开这个xib文件。拖入一个tableViewCell,设置其indentifier为`myCell`，拖入一个imageView，2个label（name和time）

###create a class for custom cell

新建一个OC class文件，命名为CustomCell,继承于 UIViewTableCell.

在customCell.h的@end前，加入属性申明：

    //nonatomic非原子操作，多线程可以访问这个变量，提高速度，但安全性要自己保证
    //weak,弱引用 
    //IBOutlet 是让xib知道这些变量可用于连接
    //UILabel 变量类型
    @property (nonatomic, weak) IBOutlet UILabel *nameLabel;
    @property (nonatomic, weak) IBOutlet UILabel *timeLabel;
    @property (nonatomic, weak) IBOutlet UIImageView *thumbnailImageView;

来实现customCell:

    @synthesize nameLabel;
    @synthesize timeLabel ;
    @synthesize thumbnailImageView;

`@synthesize`告诉编译器自动生成代码能访问我们早期定义的属性 ,如果你没有包涵这个指令，会报错.(在新的xcode中，可以不需要手动写synthesize了。但在某些时候又要写，这个待确认)


###关联xib和类
选择customCell.xib文件。选择这个cell，在indenty选择器中将其class改为CustomCell,这将这个cell指派给我们之前的class。

将UI控件和类中定义的属性链接起来。选中我新建的cell对象，在右侧的connection面板中（或者右击cell对象，在outlest中将变量和UI控件关联），将myName右侧的小圆点拖动到左侧UI区域的 对应的UI控件上。(如果你更新变量名后，要手动重新连接)

###更新SimpleTableViewController

由于我们重新定义了cell，所在对应的tableView的m文件也要调整：

    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        //这个变量就是我们在前面设置的identifier
        static NSString *simpleTableIdentifier = @"myCell";

        //这里类型要调整为新创建的类
        SimpleTableCell *cell = (SimpleTableCell *)[tableView dequeueReusableCellWithIdentifier:simpleTableIdentifier];
        if (cell == nil) 
        {
            NSArray *nib = [[NSBundle mainBundle] loadNibNamed:@"SimpleTableCell" owner:self options:nil];
            cell = [nib objectAtIndex:0];
        } 

        //cell的这几个属性就是outlet属性，而这几个属性又和实际的UI对象是关联的
        cell.nameLabel.text = [tableData objectAtIndex:indexPath.row];
        cell.thumbnailImageView.image = [UIImage imageNamed:[thumbnails objectAtIndex:indexPath.row]];
        cell.timeLabel.text = [prepTime objectAtIndex:indexPath.row];

        return cell;
    }


如果现在运行会报错，因为我们定义了tableViewCell，但SimpleTableViewController不知道啊。所以我们要将SimpleTableCell.h 导入到SimpleTableViewController.m:

    #import SimpleTableCell.h

然后给再定义一个新的方法（非强制实现）

    - (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        return 80;
    }
