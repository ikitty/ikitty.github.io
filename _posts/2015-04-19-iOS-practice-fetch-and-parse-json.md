---
layout: post
title: "iOS练习-获取并解析JSON"
description: "上周的工作杂事比较多，加之还有其他的事情处理。所以有点点落下进度了。周末继续补上。前面介绍过XML的解析，较之于XML，JSON更方便编辑和阅读。自从iOS5以后，iOS SDK获取和解析JSON变得非常方便。那么今天就练习用内置API获取和解析JSON。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

上周的工作杂事比较多，加之还有其他的事情处理。所以有点点落下进度了。周末继续补上。前面介绍过XML的解析，较之于XML，JSON更方便编辑和阅读。自从iOS5以后，iOS SDK获取和解析JSON变得非常方便。那么今天就练习用内置API获取和解析JSON。

###开始

创建一个`Master-Detail`应用，切换到Storyboard，删除默认的DetailsViewController。并调整其他细节。比如标题，表格的cell内容等。由于这里主要是测试JSON的相关使用，所以对于其他的细节就不多说。

###数据API

当我们获取到一个JSON格式的对象后，我们需要一个对象去检索数据，并构造我们的本地对象。下面简单的画了一个示意图来描述这些类是如何协同工作的。


    <MeetupCommunicator delegate>   <--delegate-- Meetup Communicator
                                                         |
                                                         |
    <MeetupManager delegate>        <--delegate-  Meetup Manager --> GroupBuilder(Group)
                                                         |
                                                         |
                                             Master View Controllere

稍作解释：我们创建了一个MeetupManager根据当前位置去请求meetup群组数据。`meetupManger`在这里扮演了Facade（外观模式中的对外接口 ），并隐藏了内部实现细节。`MeetupCommunicator `负责和Meet Api交互。当Meetup返回JSON后，我们将数据交给GroupBuilder去构造Group对象。

MasterViewController使用` Core location` 来确定当前位置，并让个MeetupManager去获取这个位置的数据。MeetupManager的其他类会检索groups，一旦发现group数据，就会通过委托和MasterViewController交互。MasterViewController最终来展示数据。

###创建JSON数据Model
 
从Model层入手，新建一个NSObject的子类叫`Group`,然后添加一些必要的属性：
 
    @interface Group : NSObject
    @property (strong, nonatomic) NSString *name;
    @property (strong, nonatomic) NSString *description;
    @property (strong, nonatomic) NSString *who;
    @property (strong, nonatomic) NSString *country;
    @property (strong, nonatomic) NSString *city;
    @end
 

###使用API获取JSON

新建一个协议`MeetupCommunicatorDelegate`，MeetupCommunicator 仅仅负责和API交互获取数据，解析数据的事情交给MeetupCommunicatorDelegate 去做。我们在协议中定义了两个方法，接受JSON数据和容错处理，代码如：

    @protocol MeetupCommunicatorDelegate 
    - (void)receivedGroupsJSON:(NSData *)objectNotation;
    - (void)fetchingGroupsFailedWithError:(NSError *)error;
    @end

现在创建`MeetupCommunicator`类，编辑头文件如下：

    //要用到本地位置
    #import <CoreLocation/CoreLocation.h>
    //定义对应的协议
    @protocol MeetupCommunicatorDelegate;
    @interface MeetupCommunicator : NSObject
    @property (weak, nonatomic) id<MeetupCommunicatorDelegate> delegate;
    - (void)searchGroupsAtCoordinate:(CLLocationCoordinate2D)coordinate;
    @end
    
我们创建了一个协议属性让它和协议保持关联。然后定义了一个可以根据坐标来搜索的方法。接下来我们编辑源文件：

    #import "MeetupCommunicator.h"
    #import "MeetupCommunicatorDelegate.h"
    #define API_KEY @"xxxxx"
    #define PAGE_COUNT 20
    @implementation MeetupCommunicator
    - (void)searchGroupsAtCoordinate:(CLLocationCoordinate2D)coordinate
    {
        NSString *urlAsString = [NSString stringWithFormat:@"https://api.meetup.com/2/groups?lat=%f&lon=%f&page=%d&key=%@", coordinate.latitude, coordinate.longitude, PAGE_COUNT, API_KEY];
        NSURL *url = [[NSURL alloc] initWithString:urlAsString];
        NSLog(@"%@", urlAsString);
        
        [NSURLConnection sendAsynchronousRequest:[[NSURLRequest alloc] initWithURL:url] queue:[[NSOperationQueue alloc] init] completionHandler:^(NSURLResponse *response, NSData *data, NSError *error) {
            
            if (error) {
                [self.delegate fetchingGroupsFailedWithError:error];
            } else {
                [self.delegate receivedGroupsJSON:data];
            }
        }];
    }
    @end
    
在上面的代码中，我们构造了API的url，然后使用NSURLConnection的`sendAsynchronousRequest`方法异步请求数据（这样不会阻塞UI线程）。当收到数据后，就将它传到delegate的`receivedGroupsJSON`方法进行处理。

###解析JSON并构造Group对象

当MeetupManager收到JSON数据后，我们使用`GroupBuilder`的类方法将数据转成到Group对象。创建一个NSObject的子类`GroupBuilder`类，编辑其头文件为：

    #import <Foundation/Foundation.h>
    @interface GroupBuilder : NSObject
    //todo 为什么要定义为类方法呢？为什么 NSError后面有两个星号
    + (NSArray *)groupsFromJSON:(NSData *)objectNotation error:(NSError **)error;
    @end

然后，编辑源文件：

    #import "GroupBuilder.h"
    #import "Group.h"
    
    @implementation GroupBuilder
    + (NSArray *)groupsFromJSON:(NSData *)objectNotation error:(NSError **)error
    {
        NSError *localError = nil;
        //后面传递的是localError的地址
        NSDictionary *parsedObject = [NSJSONSerialization JSONObjectWithData:objectNotation options:0 error:&localError];
        
        if (localError != nil) {
            *error = localError;
            return nil;
        }
        
        NSMutableArray *groups = [[NSMutableArray alloc] init];
        NSArray *results = [parsedObject valueForKey:@"results"];
        NSLog(@"Count %d", results.count);
        
        for (NSDictionary *groupDic in results) {
            Group *group = [[Group alloc] init];
            for (NSString *key in groupDic) {
                if ([group respondsToSelector:NSSelectorFromString(key)]) {
                    [group setValue:[groupDic valueForKey:key] forKey:key];
                }
            }
            [groups addObject:group];
        }
        return groups;
    }
    @end
    
`groupsFromJSON`用来转换原始JSON数据为一组group对象。自动IOS5后，可以通过iOS SDK的`NSJSONSerialization`方法来解析JSON，开发者能使用这个方法将JSON和基础数据相互转换。

当使用`NSJSONSerialization`读取JSON时，所有有key的列表（格式正确的list？）自动转换成字典对象。数组会被转换成NSArray对象，所有的key的name都被转换成NSString类型，数字被转换成NSNumber类型，最后，所有的null类型都被转换成NSNull。

Meetup API返回的JSON包含两部分，results和meta。我们只需要用到results数据，所以只对results进行提取。

###用MeetupManager整合数据

前面，我们已经解析JSON数据为iOS的对象。接下来，我们来实现MeetupManager的协调功能。

首先，创建一个新的OC协议`MeetupMangerDelegate`，并添加如下代码：

    @protocol MeetupManagerDelegate
    - (void)didReceiveGroups:(NSArray *)groups;
    - (void)fetchingGroupsFailedWithError:(NSError *)error;
    @end

这个协议定义了两个方法，当groups列表检索到解析的数据后，`didReceiveGroups`便会触发。如果有错误产生的时候，第二个方法就触发了。

然后我们创建`MeetupManger`类，并编辑头文件为：

    #import <Foundation/Foundation.h>
    #import <CoreLocation/CoreLocation.h>
    
    #import "MeetupManagerDelegate.h"
    #import "MeetupCommunicatorDelegate.h"
    
    //todo
    @class MeetupCommunicator;
    
    @interface MeetupManager : NSObject<MeetupCommunicatorDelegate>
    @property (strong, nonatomic) MeetupCommunicator *communicator;
    @property (weak, nonatomic) id<MeetupManagerDelegate> delegate;
    
    - (void)fetchGroupsAtCoordinate:(CLLocationCoordinate2D)coordinate;
    @end
    
前面说了，MeetupManager 是扮演了一个外部接口的角色。App的controller能和数据模型对象交互而不用知道内部细节。只需要使用`fetchGroupsAtCoordinate`方法就好。


然后编辑源文件：

    #import "GroupBuilder.h"
    #import "MeetupCommunicator.h"
    
    @implementation MeetupManager
    - (void)fetchGroupsAtCoordinate:(CLLocationCoordinate2D)coordinate
    {
        [self.communicator searchGroupsAtCoordinate:coordinate];
    }
    
    #pragma mark - MeetupCommunicatorDelegate
    
    - (void)receivedGroupsJSON:(NSData *)objectNotation
    {
        NSError *error = nil;
        NSArray *groups = [GroupBuilder groupsFromJSON:objectNotation error:&error];
        
        if (error != nil) {
            [self.delegate fetchingGroupsFailedWithError:error];
            
        } else {
            [self.delegate didReceiveGroups:groups];
        }
    }
    
    - (void)fetchingGroupsFailedWithError:(NSError *)error
    {
        [self.delegate fetchingGroupsFailedWithError:error];
    }

这里我们实现了`fetchGroupsAtCoordinate:coordinate`方法。

###展示数据

为了让MeetupManager能正常工作，我们要将依赖文件都引入。打开MasterViewController的源文件，引入必要的头文件，在接口后面添加我们定义的协议。并定义两个变量`_groups`和`_manager`,代码如：

    //MasterViewController.m
    #import "Group.h"
    #import "MeetupManager.h"
    #import "MeetupCommunicator.h"
    
    @interface MasterViewController () <MeetupManagerDelegate> {
        NSArray *_groups;
        MeetupManager *_manager;
    }

稍后，我们去实现MeetupManagerDelegate中定义的方法。但是，首先让我们在viewDidLoad中初始化MeetupManager：

    - (void)viewDidLoad
    {
        [super viewDidLoad];
        
        _manager = [[MeetupManager alloc] init];
        _manager.communicator = [[MeetupCommunicator alloc] init];
        _manager.communicator.delegate = _manager;
        _manager.delegate = self;
        [[NSNotificationCenter defaultCenter] addObserver:self
                                                 selector:@selector(startFetchingGroups:)
                                                     name:@"kCLAuthorizationStatusAuthorized"
                                                   object:nil];
    }

在上面的代码中，我们实例化了一个MeetupManager，并把MeetupCommunicator作为属性（communicator）绑定到manager中。最后，为了保持和当前ViewController进行关联，我们添加观察者（在前面的Notification中有提到过这个方法）。这个观察者的主要作用是接受用户对请求使用本地位置的操作反馈。并调用startFetchingGroups方法去拉取数据。

现在，我们来定义startFetchingGroups方法：

    - (void)startFetchingGroups:(NSNotification *)notification
    {
        [_manager fetchGroupsAtCoordinate:self.locationManager.location.coordinate];
    }
    
前面，我们在头文件中让MasterViewController遵循MeetupManagerDelegate协议，那么，我们还需要去执行协议中定义的方法（很直观，不解释）：

    - (void)didReceiveGroups:(NSArray *)groups
    {
        _groups = groups;
        [self.tableView reloadData];
    }
    - (void)fetchingGroupsFailedWithError:(NSError *)error
    {
        NSLog(@"Error %@; %@", error, [error localizedDescription]);
    }

最后，又到我们的熟悉的部分了，定义tableView的相关方法：

    - (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
    {
        return _groups.count;
    }
    
    - (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
    {
        DetailCell *cell = [tableView dequeueReusableCellWithIdentifier:@"Cell" forIndexPath:indexPath];
        Group *group = _groups[indexPath.row];
        [cell.nameLabel setText:group.name];
        [cell.whoLabel setText:group.who];
        [cell.locationLabel setText:[NSString stringWithFormat:@"%@, %@", group.city, group.country]];
        [cell.descriptionLabel setText:group.description];
        return cell;
    }

CMD + R ！
