---
layout: post
title: "OC和JavaScript的通信"
description: "为了更新方便，在nativeApp中直接用uiwebview引入网页内容是很常见的。但有时候，我们也需要对App中的网页有一些差异化的展示。这就需要涉及OC和JS的通信了。"
tags: [ Objective-c ]
category: iOS
---
{% include JB/setup %}

为了更新方便，在nativeApp中直接用uiwebview引入网页内容是很常见的。但有时候，我们也需要对App中的网页有一些差异化的展示。这就需要涉及OC和JS的通信了。

###OC中执行JS

使用`stringByEvaluatingJavaScriptFromString`在OC中执行JS语句:

    NSString *strJS = @"var isInApp =1 ;";
    [self.detailWebView stringByEvaluatingJavaScriptFromString:strJS];
    //在JS中就可以使用到isInApp变量了

在OC中调用JS方法是非常方便的，WebView有一个`windowScriptObject`属性，可以获得脚本对象，然后便可以调用`callWebScriptMethod:withArguments`将消息转发给JS中对象的方法和参数:

    //在OC中的调用
    - (void)ocAction:(id)sender
    {
        NSArray *args = @[@"Hello,JS!"];
        id result = [[webView windowScriptObject] callWebScriptMethod:@"JSFunction" withArguments:args];
        NSLog(@"%@",result);
    }

    //在JS中对应的方法
    function JSFunction(parameter)
    {
        //显示OC返回的值
        alert(parameter);
        //返回成功的消息
        return 'Web程序已经收到消息！';
    }

###JS中执行OC

通过设置webView的`frameLoadDelegate`，在`webView:didClearWindowObject:forFrame:`回调方法中，指定一个本地对象（该对象实现WebScripting协议），然后JS中就可以直接调用该对象的相关方法。

    //该方法用于JS中调用
    - (WebScriptObject *)status:(WebScriptObject *)jsObject
    {
        //将JS发过来的信息显示出来
        NSString *message = [jsObject valueForKey:@"message"];
        NSLog(@"%@",message);
        //返回成功的信息(WebScriptObject对象不能自己创建，所以此处复用了传入的参数)
        [jsObject setValue:@"本地端已经收到消息啦！" forKey:@"message"];
        return jsObject;
    }


    //通过此回调，将self传递给JS环境
    - (void)webView:(WebView *)sender didClearWindowObject:(WebScriptObject *)windowObject forFrame:(WebFrame *)frame
    {
        [windowObject setValue:self forKey:@"native"];
    }


    + (BOOL)isSelectorExcludedFromWebScript:(SEL)selector
    {
        if (selector == @selector(status:))
        {
            return NO;
        }
        return YES;
    }

    //返回本地方法在JS中的名称(不实现此方法，则JS中方法名与OC中相同)
    + (NSString *)webScriptNameForSelector:(SEL)sel
    {
        if (sel == @selector(status:))
        {
            return @"ocMethod";
        }
        return nil;
    }

JS中的调用如下：

    function CallNative() {
        if (native)
        {
            //将消息组装成对象发给OC
            var parameter = {'message':'Hello,Objective-C!'};
            var result = native.ocMethod(parameter);
            //显示OC返回的结果
            alert(result['message']);
        }
    }
