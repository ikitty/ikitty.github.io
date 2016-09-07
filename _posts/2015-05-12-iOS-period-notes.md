---
layout: post
title: "iOS some notes and TJ App"
description: "阶段学习小结"
tags: [cocos]
category: Other
---
{% include JB/setup %}

阶段性小结

###OC的动态特性

编译和链接要做的事情推迟到runtime（c和汇编实现）来做

动态类型：运行时决定对象类型
动态绑定：运行时决定调用的方法
动态加载：在运行时根据需求加载资源


###tableview

tableview`<uitableviewDataSource, uitableviewDelegate>`，为了展示table，我们必须遵循两个协议并实现对应的方法。dataSource连接着数据和view，它对应的必须实现的方法是：cellForRowAtIndex，numberOfRowInSection。uitableViewDelegate处理ui的展示，比如每行的高度。

值得注意的是：除了在代码层遵守协议和实现方法，我们还需要将view中的元素和vc用协议关联起来，操作方法就是右键drag UI元素到VC上，然后选中要关联的协议。

###收起键盘

首先在头文件中加入UITextFiledDelegate协议，然后在sb中将ui元素和VC的协议关联，最后在源文件中实现下面的方法
 
    -(BOOL)textFieldShouldReturn:(UITextField *)textField
    {
        if (textField == self.txt) {
            [textField resignFirstResponder];
        }
        return YES;
    }



###cell的使用

自定义cell和默认cell的使用区别

    //赋值的时候不加类型申明会有警告，但是元素的tableCell的就可以不用加
    //UITableViewCell* orgCell = [tableView dequeueReusableCellWithIdentifier:cellId ] ;
    if (orgCell == nil ){
        orgCell = [[uitableviewCell alloc] initWithStyle: uiTableViewCellStyleDefaultDefaultReserIdentifier: cellId];
    }


    MyCell* cell = (MyCell*)[tableView dequeueReusableCellWithIdentifier: id]
    if (cell == nil){
        NSArray* nib = [[NSBundle mainBundle] loadNibNamed: id owner:self options:nil];
        cell = nib[0] ;
    }

###拼接字符串

    [nsstring stringWithFormat: @"%@, %@", str1, str2] ;
    [[nsstring alloc] initWithFormat: ...]

init.. 是实例方法，string...是类方法，
 
	
###weak, strong ,copy 等等
 
在没有property的世界里，要设置/访问一个对象的属性，我们需要手动实现setter和getter

    {
        NSString *_recievedContent;
    }
	
    //setter
    -(void)setRecievedContent:(NSString *)recievedContent
      {
         _recievedContent = recievedContent;
      }
    //getter
      -(NSString *)recievedContent
      {
         return recievedContent;
      }

有了property，就一句话搞定

    @property (nonatomic, copy) NSString *str; 

那么nonatomic等属性是什么意思呢？这类属性分为三类：

**原子性**

- atomic(默认)：atomic 意为操作是原子的，意味着只有一个线程访问实例变量。atomic 是线程安全的至少在当前的访器上我是安全的。但是很少使用。比较慢，这跟 ARM 平台和内部锁机制有关。
- nonatomic：跟 atomic 刚好相反。表示非原子的，可以被多个线程访问。它的速度比atomic快。但不能保证在多线程环境下的安全性，在单线程和明确只有一个线程访问的情况下广泛使用。

**访问器控制**

- readwrite(默认)：readwrite 是默认的，表示同时拥有 setter 和 getter。
- readonly：readonly 表示只有 getter 没有 setter。

**内存管理**

- *retain*：使用了 retain 意味着实例变量要获取传入参数的所有权。具体表现在 setter 中对实例变量先 release 然后将参数 retain 之后传给它。
- strong：是在ARC伴随IOS引入的时候引入的关键字是 retain 的一个可选的替代。表示实例变量对传入的参数要有所有权关系即强引用。strong 跟 retain 的意思相同并产生相同的代码，但是语意上更好更能体现对象的关系。

- *assign*（默认）：用于值类型，如 int、float、double 和 NSInteger，CGFloat 等表示单纯的复制。还包括不存在所有权关系的对象，比如常见的 delegate。
- weak： weak 跟 assign 的效果相似，不同的是 weak 在对象被回收之后自动设置为 nil。而且weak 只能用在 iOS5 或以后的版本，对于之前的版本，使用 unsafe_unretained。
- copy：copy 是为是实例变量保留一个自己的副本。

###synthesize

在xcode4.4之前，要使用这个属性手动生成getter和setter

	@synthesize recievedContent = _recievedContent;

xcode5之后，就不需要synthesize了，但是如果你用了synthesize，那么你可以直接使用变量（不需要self.前缀）

	// 没有synthesize时，这么用
	self.recievedContent = @"xxxxxxxxx";
	
	@synthesize recievedContent;
	// 加上这么一句，就可以这么写
	recievedContent = @"xxxxxxxxx";  

`self.var` 调用的是 getter 方法，而`var`是对这个指针的操作。

**ps：但，这的区别是什么呢？getter的本质也是从内存去数据，指针也是从内存地址去拿数据把。**

###定义变量的几种方法

私有实例变量：在源文件中的interface中用大括号定义。这种变量只能在内部访问。（据测试，下载interface和implemention关键词后面效果一样）


    @interface SelfInfoTableViewController ()
    {
        NSArray *var;
    }
    @end
    @implemention
    {
        nsstring * var;
    }
    @end
    //在源文件中可以直接使用（不需要self.var）

在头文件中申明property (方便外部访问)，内部通过`self.var`来访问

    @property  (nonatomic,strong) NSArray *basicInfo;

在头文件中的interface关键字后面申明。（经过简单的测试貌似方案1没什么区别，有个特点是，写在头文件中，一目了然，看接口就知道这个方法用到了哪些内部变量；但写在m文件中也省去了切换文件的麻烦）

    @interface loadingView: UIView
    {
        NSString* str;
    }

###方法

    //类方法
    + (void) method;
    //实例方法
    - （id） method；

方法调用，时要向对象发个消息。方括号里面就是消息表达式 (不就是调用方法吗？为什么叫发消息)

    // x = [[NSString alloc] init ] 
    //alloc 类方法，分配内存，init实例方法

###UI设置

    // 定义所有子页面返回按钮的名称
    navigationItem.backBarButtonItem = UIBarButtonItem(title: "返回", style: UIBarButtonItemStyle.Plain, target: nil, action: nil)

ps: about队列 http://www.cnblogs.com/dsxniubility/p/4296937.html

 


##TJApp 

### done

- tabbar icon
- use navigation manage detail
- 解析不规则的json
- 在app中去掉detail页面中的nav
- 禁止webview下拉效果
- 使用navigation管理webview
- 自定义navigation样式
- tab 切换
- 显示加载状体
- 下拉刷新 
- segue modal 展示detail
- 无网络的提示（点击刷新）
- OC和JS通信（webview引入的页面同时要兼容移动浏览器和原生App）
- 手势左滑动来后退
- loadingView的居中问题

###todo

- collection view 展示壁纸
- 缓存数据(增加失效日期)


