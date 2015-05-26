---
layout: post
title: "初窥WebKit Framework"
description: "最近几周真的是忙得飞起。无论是工作方面的事情，还是个人的学习计划，都是超负荷运行。忙归忙，笔记还是要坚持。今天说下webkit framework，虽然在nativeApp中使用webview引入网页是很方便的，但webView在性能上还是有很大限制的，没有Safari上浏览网页那么流畅。幸运的是，在iOS8中引入了WebKit Framework，借助Nitro JS引擎，它会让你的webpage性能飞上天。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

最近几周真的是忙得飞起。无论是工作方面的事情，还是个人的学习计划，都是超负荷运行。忙归忙，笔记还是要坚持。今天说下webkit framework，虽然在nativeApp中使用webview引入网页是很方便的，但webView在性能上还是有很大限制的，没有Safari上浏览网页那么流畅。幸运的是，在iOS8中引入了WebKit Framework，借助Nitro JS引擎，它会让你的webpage性能飞上天。

###开始

这次我们创建一个浏览器来体验WebKit（webkit framewrok）的新特性。新建一个SingleViewApp，选择使用swift语言，选择创建通用App。首先，在ViewController.swift中引入webkit framework，并定义webView变量：

	import WebKit
	var webView: WKWebView

初始化webview,将webview的frame设置为零：

	required init(coder aDecoder: NSCoder) {
		self.webview = WKWebView(frame: CGRectZero)
		super.init(coder: aDecoder)
	}

在`viewDidLoad`中将webview的视图加入主视图，并添加约束：

	view.addSubView(webView)
	
	//禁用自动生成约束
	webView.setTranslateAutoresizingMaskIntoConstraints(false)

	//定义宽高约束，其宽高等于父级view的宽高
	let height = NSLayoutConstraint(item: webView, attribute: .Height, relateBy: .Equal, toItem: view, attribute: .Height, multiplier: 1, constant: 0)
	let width = NSLayoutConstraint(item: webview, attribute: .Width, relateBy: .Equal, toItem: view, attribute: .Width, multiplier: 1, constant: 0)
	view.addConstraints([height, width])

继续在viewDidLoad中加入如下代码：

	//先hardcode，后续会做一个textfiled用于输入url
	let url = NSURL(string: "http://xxxx")
	let request = NSURLRequest(URL: url!)
	webView.loadRequest(request)

CMR+R来测试下，当拖动页面滚动时，可以看到页面会经过半透明的导航。我们可以禁止它。在main.Storyboard中选择ViewController，在属性选择器中，在Extend Edegs组中取消Under Top Bars选项。


接下来实现url输入框。在Storyboard中，拖入一个view到导航栏，在属性栏中，设置空背景色。为这个view创建一个outlet连接为`barView`，会生成如下代码：

	@IBOutlet weak var barView : UIView!

在`viewDidLoad`中加入如下代码（保证在super.viewDidLoad()之后）：

	barView.frame = CGRect(x:0, y:0, width:view.frame.width, height: 30)

继续添加如下方法，以确保在设备翻转的时候能重设barView的尺寸：

	override func viewWillTransitionToSize(size: CGSize, withTransitionCoordinator coordinator: UIViewControllerTransitionCoordinator) {
	    barView.frame = CGRect(x:0, y: 0, width: size.width, height: 30)
	}
	
然后拖入一个textfield到barView中，点击画布下方的Pin按钮，来设置其约束，在这里，我们将button的上下左右的值设为0.为textfield创建一个outlet连接，叫做urlField：

	@IBOutlet weak var urlField: UITextField!

我们想要ViewController接受UITextFieldDelegate协议，在树结构中，右键将textField拖向ViewController，并选择popup delegate。继续选中UITextField，在属性栏中进行如下设置：

- clear 按钮： 在编辑的时候出现
- 修正：不自动修正
- 键盘类型：url
- 返回键：go

修改类申明，以便于接受UITextFieldDelegate协议：

	class ViewController: UIViewControler, UITextFieldDelegate

然后，添加协议的方法：

	func textFieldShouldReturn(textField: UITextField) -&gt; Bool {
	    urlField.resignFirstResponder()
	    webView.loadRequest(NSURLRequest(URL: NSURL(string: urlField.text)!))
	    return false
	}

上面的代码会收起键盘，并加载给定url。当然这里我们并没有做自动添加http协议头的处理，在测试的时候，需要手动输入协议部分。

###通过历史记录来导航

选择一个简单的浏览器已经可以工作量，但是还缺少一些特性，比如前进，返回按钮，加载状态等。

借助KVO（key value observing）加载状态，我们可以将页面的title动态更新到UI中。首先来添加前进，返回、重加载等按钮。

在Storyboard中，选中ViewController，切换到属性栏，在模拟metrics下面，将bottom bar隐藏。然后拖入一个toolbar放在底部，设置约束：左右和下方都是0，并确保 Constrain to margins没有选中。

在viewDidLoad中动态设置webview的高度：

	let height = NSLayoutConstraint(item: webView, attribute: .Height, relatedBy: .Equal, toItem: view, attribute: .Height, multiplier: 1, constant: -44)

删除toolbar中默认的item，添加三个bar button，分别用来表示返回，前进和重加载。并建立连接：

	@IBOutlet weak var backButton: UIBarButtonItem!
	@IBOutlet weak var forwardButton: UIBarButtonItem!
	@IBOutlet weak var reloadButton: UIBarButtonItem!

然后为这几个按钮创建action，并实现对应的事件处理。代码很直观，就不解释了：

	@IBAction func back(sender: UIBarButtonItem) {
		webView.goBack()
	}
	    
	@IBAction func forward(sender: UIBarButtonItem) {
		webView.goForward()
	}
	    
	@IBAction func reload(sender: UIBarButtonItem) {
		let request = NSURLRequest(URL:webView.URL!)
	    webView.loadRequest(request)
	}

在viewDidLoad中初始化back和forward按钮：

	backButton.enabled = false
	forwardButton.enabled = false

继续，在约束和loadRequest之间添加如下代码：

	webView.addObserver(self, forKeyPath: "loading", options: .New, context: nil)

实现观察事件：

	override func observeValueForKeyPath(keyPath: String, ofObject object: AnyObject, change: [NSObject : AnyObject], context: UnsafeMutablePointer) {
	    if (keyPath == "loading") {
	        backButton.enabled = webView.canGoBack
	        forwardButton.enabled = webView.canGoForward
	    }
	}

到此为止，一个简单浏览器的工作功能都实现了，可以按下CMD + R 来体验下。当然，优化是永无止境的，比如还可以增加错误处理的功能，展示加载进度等。这里就不一一描述。
