---
layout: post
title: "JavaScript异步加载资源"
description: "性能，还是性能。为了性能，我们将一些优先级不那么高的资源动态载入到页面中，以便于浏览器优先加载页面的主要内容，从而为用户提供更好的浏览体验。关于异步加载资源，各个浏览器对各种资源都有着各种坑。这里一并整理下。"
tags: [ javascript ]
category: frontend
---
{% include JB/setup %}

性能，还是性能。为了性能，我们将一些优先级不那么高的资源动态载入到页面中，以便于浏览器优先加载页面的主要内容，从而为用户提供更好的浏览体验。关于异步加载资源，各个浏览器对各种资源都有着各种坑。这里一并整理下。

###1.预加载图片
 
图片除了可以用创建 img 节点的方法加载外，还可以用常见的缓存图片方法，Image对象加载，基本上创建出来的img dom node 和 new Image 对象 一样的，但是 ie 对于从缓存中加载的图片触发事件有区别 (和事件添加位置有区别) ，详见代码。特别注意判断缓存加载，有的浏览器（ie chrome）缓存不触发load事件，需要判断`img.complete`。
 
###2.动态加载 script
 
script 不像图片有专有的 Image 对象，只能通过创建标签的方式加载script，但是 ie 和其他浏览器有区别，其他浏览器可以判断 load 事件 ，像图片一样，而 ie 不会触发这个事件，只能通过判断 readystate 的方式 来解决。其中的差异如：
 
- 动态创建标签时，firefox当设置src时并不会立即开始下载脚本，只有将脚本标签 append 到 document 时，才开始下载，而image则在img src设置后立即开始下载，即使还没有被 append 到 document。
- ie 浏览器判断 onreadystatechange 比较怪异，loaded 和 complete 每个并不确定出现，所以最好两者都判断，但为了防止执行逻辑两次，脚本加载后将 onreadystatechange 置空为好 ，如：

```
function loadScript(url, callback){  
    var script = document.createElement("script");
    script.type = "text/javascript";  
    
    if (script.readyState){  //IE  
        script.onreadystatechange = function(){  
            if (script.readyState == "loaded" || script.readyState == "complete"){  
                script.onreadystatechange = null;  
                callback();  
            }  
        };  
    } else {  //Others  
        script.onload = function(){  
            callback();  
        };  
    }  
    
    script.src = url;  
    document.body.appendChild(script);  
}  
```

### Coupling Asynchronous Scripts

若一段inline脚本依赖于一个外部脚本文件，而我们用script dom 添加的方式载入外部脚本，因为除了firefox 都不能保证等外部脚本加载完毕再执行内部脚本，所以的采用其他方法。

####1.判断script状态

```
var aExamples = [['couple-normal.php', 'Normal Script Src'],...];  
function init() {  
    //依赖于menu.js  
    EFWS.Menu.createMenu('examplesbtn', aExamples);  
}  
var domscript = document.createElement('script');  
  
domscript.src = "menu.js";  
//opera 会 load 两次，so 设置变量  
domscript.onloadDone = false;  
//标准方式  
domscript.onload = function() {  
    domscript.onloadDone = true;  
    init();  
};  
  
//ie 和 opera ?  
domscript.onreadystatechange = function() {  
    if ( "loaded" === domscript.readyState && ! domscript.onloadDone ) {  
        domscript.onloadDone = true;  
        init();  
    }  
}  
document.getElementsByTagName('head')[0].appendChild(domscript);  
```

####2.Degrading Script Tags

ejohn 在他的blog中提出了这个优雅而又怪异的方法 ，关键要在外部脚本后加入代码执行外部脚本的 innerHTML（将加载完后要执行的代码变相的扔到依赖的js中去执行） . 如上述的 menu.js，最后添加

```
var scripts = document.getElementsByTagName("script");  
var cntr = scripts.length;  
while ( cntr ) {  
    var curScript = scripts[cntr-1];  
    //如果找到它自己  
    if ( -1 != curScript.src.indexOf("menu.js") ) {  
        //执行依赖它的内部脚本  
        eval( curScript.innerHTML );  
        break;  
    }  
    cntr--;  
}  
```

依赖menu.js的代码：

```
<script type="text/javascript">  
var aExamples = [['couple-normal.php', 'Normal Script Src'],...];  
function init() {  
    EFWS.Menu.createMenu('examplesbtn', aExamples);  
}  
var domscript = document.createElement('script');  
domscript.src = "menu.js";  
  
//设置依赖的要执行的代码  
if ( -1 != navigator.userAgent.indexOf("Opera") ) {  
    domscript.innerHTML = "init();";  
}  
else {  
    domscript.text = "init();";  
}  
document.getElementsByTagName('head')[0].appendChild(domscript);  
</script>  
```
####3.其他方法

比如 setTimeout polling，外部脚本硬编码callback，window.onload 再执行内部脚本，都不如上述两个方法。
 
注意： 异步新载入的script标签即使后来删除掉，其里面定义的函数,变量仍然存在于window 中，所以请不要将这种方式滥用，建议只用于跨域的数据交换 。
