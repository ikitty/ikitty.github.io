---
layout: post
title: "iOS练习小结-cell-plist-launchImage-segue-webview-tab"
description: "本小结包含内容有：table行选中，操作table cell，plist使用，设置LaunchImage,segue的实践，tab，webview等"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

本小结包含内容有：table行选中，操作table cell，plist使用，设置LaunchImage,segue的实践，tab，webview等

###监听表格行的选中事件

直接实现`didSelectRowAtIndexPath`方法即可（还有个有趣的方法叫`didDeSelectRowAtIndexPath`）：

    - (void) tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
    {
        //初始化一个alert
        UIAlertView *myAlert = [[UIAlertView alloc] initWithTitle:@"Hi Guy" message:myData[indexPath.row] delegate:nil cancelButtonTitle:@"okay" otherButtonTitles:nil];
        [myAlert show];
    }

###删除一个cell

删除一个cell，对应的数据也要删除。由于之前的练习都是用使用固定长度的array，所以这里要将myData转成非固定长度的mutableArray形式：

    //转换类型
    mydata = [orgData mutableCopy]
    - (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
    {
        [tableData removeObjectAtIndex:indexPath.row];
        [tableView relaodData]
    }

###关于table cell

一个tablecell默认有三部分组成： img, textlabel ,accessory view.要标识选中态，只要在didSelection中加入如下代码：

    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    cell.accessoryType = UITableViewCellAccessoryCheckmark;
    //如果不想有选中颜色，那么：
    [tableView deselectRowAtIndexPath:indexPath animated:YES];

###使用plist

plist就像个JS对象，可以放一些默认信息,注意取值的语法就好了

    NSString *plistPath = [[NSBundle mainBundle] pathForResource:@"Heros" ofType:@"plist"];
    myData = [[NSArray alloc] initWithContentsOfFile:plistPath];

###设置launch image

学习的时候为个费了点时间，教程太老了。后来搜到的方法很简单了。xCode从某个版本开始引入xcassets来解决多终端的图片适配问题。在新建的app项目中，有`images.xcassets`文件，里面有appIcon和launchImage设置的选项，将对应尺寸的图片拖入到对应的框框中即可，不需要其他设置（可是TMDxCode中没有任何提示是直接把图片拖入即可的。）

###segue

segue是两个视图之间的一个过渡链接器(可以传递数据的哈)。在本例中我们将用它来链接table行和对应的detail。在此之前先介绍下Navigator,prototype cell.

###导航控制

选择一个viewController(包含一个tableView)，然后embed in一个Navigator controller。

选中nav，在右侧的面板中找到title，并设置好其属性，这个title会显示在nav上

###prototype cell

其实个性化一个cell还是其他的简答方法，比如使用tableView的prototype cell.选中tableView，在右侧属性面板中，将prototype cells的值改为1，这时，你会看到tableView中多了一个prototype cell。

选择tableViewController，在右侧面板，设置accessoryType，设置identifier（重要，这里的id和我们在TV中定义cell时的id要一致）

###创建detailViewController

拖入一个viewController，然后拖入一个Label到VC中，效果仅供测试，然后关键的一步：按住ctrl键，将table cell 拖向刚创建的VC。并在弹出的对话框中选择 push，这样就创建了一个segue，当你点击cell时，会滑动到detail界面
但detail此时还没有数据，因为对应的viewController没有存储变量，所以，我们创建了一个class:MyDetailVC，并在属性面板中将detail的viewController改为myDetailVC。

数据传输，我们需要两个变量，bookName用于存储传递来的变量，bookLabel用于和detail的UI的label关联并显示变量。在detailViewController中，我们加入:

    @property (nonatomic, strong) IBOutlet UILabel *bookLabel;
    @property (nonatomic, strong) NSString *bookName;

并在m文件中设置synthesize （话说这里为啥一定synthesize呢？不是说不要设置了吗）

    @synthesize bookLabel;
    @synthesize bookName;

连接bookLabel 和 对应label，并在load后加入显示book名称的逻辑

    bookLabel.text = bookName;

好了，轮到Segue来show了。Segue在数据传输中是一个桥梁，这里我们设置其ID为: segueDetail, 并在主viewController的m文件实现segue的相关方法:

    - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
        if ([segue.identifier isEqualToString:@"segueDetail"]) {
            NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
            MyDetailViewController *destViewController = segue.destinationViewController;
            destViewController.bookName = [recipes objectAtIndex:indexPath.row];
        }
    }

prepareForSegue 方法发生在调整事件触发后和调整行为发生前的。所以不用担心，页面调整后，数据还没过去。

注意：此时的代码会报错的。因为我们还有一些准备工作需要做：

1. self.tableView 不知道，这个我们来在主viewController的头文件加个声明,并将outlet和 UI链接起来

    @property (nonatomic, strong) IBOutlet UITableView *tableView;

2. MyDetailViewController不知道，我们在主viewController中`import`下即可。

###tab导航

这里的有个语法问题特别蛋疼，比如我要将viewController嵌入到一个navigator中，应该是embed with吧(用navigator来包含住当前的viewController)，可是工具上却写着 embed in，看起来好像把nav插入到viewController中。到底是我理解错了，还是Apple词不达意。
 
选中tableViewController，embed with navigator（用tab导航包含住一个tableViewController）,此时可以修改tab item的title

####创建一个新的tabItem

添加一个新的nav controller, 按住ctrl，将tab 拖向新的nav controller.删除默认的tableViewController，添加一个viewController，并按ctrl，将navigator拖向新的viewController(这个用来载入webview)
 
###webview
 
使用很简单，记得语法就好： 

    NSURL *url = [NSURL fileURLWithPath:[[NSBundle mainBundle]pathForResource:@"about.html" ofType:nil]];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    [webview loadRequest:request];

