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

    //todo
