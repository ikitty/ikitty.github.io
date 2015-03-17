---
layout: post
title: "iOS练习小结-简单的Table"
description: "最近基本都是在跟着教程去做些联系，顺便也小结下做过的练习。给自己长点记性。"
category: other
tags: []
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

至今，可以按下Cmd+R来预览app了。我们的目标远不止此，继续。
