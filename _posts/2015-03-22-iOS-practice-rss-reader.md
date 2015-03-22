---
layout: post
title: "iOS练习-RssReader"
description: "结合教程做一个简单的RssReader。本练习中主要用到了XMLParser的一些功能，故记录关键步骤和一些疑惑。教程中还有一些粗心大意的“错误”，作者也没有改正过来。实在是不应该。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

结合教程做一个简单的RssReader。本练习中主要用到了XMLParser的一些功能，故记录关键步骤和一些疑惑。教程中还有一些粗心大意的“错误”，作者也没有改正过来。实在是不应该。

###新建项目

新建一个Master-detail的app，创建后可以在storyBoard中看到三部分：

- navigation bar
- tableView for FeedList
- detailView 用于展示详情

将主ViewController的tableView建立链接得：

    @property (strong, nonatomic) IBOutlet UITableView *tableView;

回到detailViewController，删除默认的label控件和与之链接的属性申明，顺便也将detailItem属性删除。最后，加入一个webView的视图，并建立链接。同时新增一个url属性用来传递变量。

    @interface APPDetailViewController : UIViewController
    @property (copy, nonatomic) NSString *url;
    @property (strong, nonatomic) IBOutlet UIWebView *webView;
    @end

###调整MasterViewController

申明一系列变量。命名一目了然以至于都不用解释。

    @interface APPMasterViewController () {
        NSXMLParser *parser;
        NSMutableArray *feeds;
        NSMutableDictionary *item;
        NSMutableString *title;
        NSMutableString *link;
        NSString *element;
    }
    @end

调整viewDidLoad的代码：

    [super viewDidLoad];
    feeds = [[NSMutableArray alloc] init];
    NSURL *url = [NSURL URLWithString:@"http://images.apple.com/main/rss/hotnews/hotnews.rss"];
    parser = [[NSXMLParser alloc] initWithContentsOfURL:url];
    [parser setDelegate:self];
    [parser setShouldResolveExternalEntities:NO];
    [parser parse];
    
删除不用的方法`insertNewObject`,并对默认一些方法进行调整：

    - (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
        return 1;
    }
    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
        return feeds.count;
    }
    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"Cell" forIndexPath:indexPath];
        // 主要调整了这里
        cell.textLabel.text = [[feeds objectAtIndex:indexPath.row] objectForKey: @"title"];
        return cell;
    }

###实现xml解析器的委托

在masterViewController的头文件接口中申明协议。

    @interface RssMasterViewController : UITableViewController <NSXMLParserDelegate>
    
解析器发现一个新元素时，会触发`didStartElement`事件，当我们找到一个“item”元素时，我们要初始化一些变量用于接下来存储数据。

    - (void)parser:(NSXMLParser *)parser didStartElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName attributes:(NSDictionary *)attributeDict {
        element = elementName;
        if ([element isEqualToString:@"item"]) {
            item    = [[NSMutableDictionary alloc] init];
            title   = [[NSMutableString alloc] init];
            link    = [[NSMutableString alloc] init];
        }
    }
    
解析器每当发现一个字符时，都出触发`foundCharacters`事件，这就是为什么前面我们要申明title和link为动态string的原因。

    - (void)parser:(NSXMLParser *)parser foundCharacters:(NSString *)string {
        if ([element isEqualToString:@"title"]) {
            [title appendString:string];
        } else if ([element isEqualToString:@"link"]) {
            [link appendString:string];
        }
    }

当解析器检测到元素结束位时，出触发`didEndElement`，此时，我们将前面捕获到的数据存入到feeds中

    - (void)parser:(NSXMLParser *)parser didEndElement:(NSString *)elementName namespaceURI:(NSString *)namespaceURI qualifiedName:(NSString *)qName {
        if ([elementName isEqualToString:@"item"]) {
            //[item setObject:title forKey:@"title"];
            //使用新的语法写更方便
            item[@"title"] = title;
            [item setObject:link forKey:@"link"];
            [feeds addObject:[item copy]];
        }
    }

最后，当解析器接测到整个文档结束时，又会触发`parserDidEndDocument`,此时我们重新渲染tableView数据即可。

    - (void)parserDidEndDocument:(NSXMLParser *)parser {
        [self.tableView reloadData];
    }

###实现Feed详情页面

删除不用的方法，并调整下面整个方法：

    - (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
        if ([[segue identifier] isEqualToString:@"showDetail"]) {
            NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
            NSString *string = [feeds[indexPath.row] objectForKey: @"link"];
            [[segue destinationViewController] setUrl:string];
        }
    }
    
注意`[[segue dest...] setUrl:...]`。之前没见过这种语法，根据测试结论来看，是一种快捷设置属性的方法，但是要将属性首字母变为大写。等价于下面这种写法：

    RssDetailViewController *dest = [segue destinationViewController];
    dest.xUrl = string;

但直接赋值`[segue dest...].xUrl = string`却是不行额。

最后，我们根据获取到的url在webview中loddRequest即可。

    - (void)viewDidLoad {
        [super viewDidLoad];    
        NSURL *myURL = [NSURL URLWithString: [self.url stringByAddingPercentEscapesUsingEncoding:
                                              NSUTF8StringEncoding]];
        NSURLRequest *request = [NSURLRequest requestWithURL:myURL];
        [self.webView loadRequest:request];
    }


