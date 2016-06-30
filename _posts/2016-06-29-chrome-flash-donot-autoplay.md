---
layout: post
title: "chrome下flash不能自动播放的原因和解决方案"
description: "2015年底，Google宣布了针对Flash内容的限制，浏览器将检测并默认暂停页面上的所有Flash内容，但不会影响页面上的重要内容。由于自己的业务中插入的视频一直都运行良好，也没有太在意。今天同事说，她网站上的视频在chrome中不能自动播放了，即使把我的视频播放代码引入到她的业务中，视频还是不能自动播放。"
tags: [iOS, certificate]
category: mac
---
{% include JB/setup %}

2015年底，Google宣布了针对Flash内容的限制，浏览器将检测并默认暂停页面上的所有Flash内容，但不会影响页面上的重要内容。由于自己的业务中插入的视频一直都运行良好，也没有太在意。今天同事说，她网站上的视频在chrome中不能自动播放了，即使把我的视频播放代码引入到她的业务中，视频还是不能自动播放。


竟然有这种事儿！宝宝表示不服！随即拿到她的代码进行对比，几乎一样的代码，放到她的业务中，视频就是不能自动播放。于是乎，使出绝招，将代码大卸八块，逐个排查。其中蛋疼过程就不说了，最后发现**视频尺寸**会影响chorme中flash的自动播放。

然后chrome并没有告诉开发者什么才是重要的，想想也对，如果告诉你了，你们这帮家伙岂不是又要用各种奇技淫巧来骗过我了。结合刚排除问题时遇到的坑，经过一番搜索，终于让我发现了这个小秘密，原来chrome认为的的“重要”就是要符合下面任意一种条件（四选一即可）：

- flash文件和页面文件同域
- flash的尺寸小于`5px x 5px`
- flash的最小宽度为`398px`，最小高度为`298px` (强迫症肯定会定义为400x300)
- flash比例为16:9，且面积要大于120000

上面的结论来自于官方源码：

    // Content below this size in height and width is considered "tiny".
    // Tiny content is never peripheral, as tiny plugins often serve a critical
    // purpose, and the user often cannot find and click to unthrottle it.
    const int kTinyContentSize = 5;
    
    // Cross-origin content must have a width and height both exceeding these
    // minimums to be considered "large", and thus not peripheral.
    const int kLargeContentMinWidth = 398;
    const int kLargeContentMinHeight = 298;
    
    // Mark some 16:9 aspect ratio content as essential (not peripheral). This is to
    // mark as "large" some medium sized video content that meets a minimum area
    // requirement, even if it is below the max width/height above.
    const double kEssentialVideoAspectRatio = 16.0 / 9.0;
    const double kAspectRatioEpsilon = 0.01;
    const int kEssentialVideoMinimumArea = 120000;



查看更多请戳：https://cs.chromium.org/chromium/src/content/renderer/peripheral_content_heuristic.cc

###解决方案

既然知道了潜规则，对应的解决方案也就有了。

如果是小视频，且数量不多，可以将视频文件迁移到**同域**下即可。如果是外链视频，比如腾讯视频。可以用下面的解决方案：

**方案一修改尺寸**

修改视频尺寸，宽度大于398px，高度大于298px


**方案二调整分辨率**

不能改尺寸？可以调整分辨率哦，保证分辨率为`16：9`，且保证面积大于`120000`哦


**方案三使用scale**

先将视频缩放成符合规则的尺寸，然后使用`transform：scale`缩放到页面所需要的尺寸。这个方案会导致页面重绘，有损性能，而且scale的兼容性也不好。所以不建议使用。虽然不建议使用，但是开开脑洞也不错，这里有demo演示，有兴趣的戳下面：


**方案四**
加载一个符合尺寸（398*298）的空白视频，然后再移除掉这个视频。(这是我在排除问题的时候试出来的)

    var elEmtpy = document.createElement('div');
    elEmtpy.setAttribute('id', 'alexEmptyFlash') ;
    elEmtpy.style.opacity = '0'
    document.body.appendChild(elEmtpy) ;
    //插入符合尺寸的临时视频
    injectSwf({ 'wrapId': 'alexEmptyFlash' ,'vid': 'p0307oxaen8' ,'w': 398 , 'h': 298, 'auto': 1 });

    setTimeout(function () {
        document.body.removeChild(elEmtpy);
        elEmtpy.innerHTML = '';
    }, 20);

###适合懒人的方案

四种demo写下来，发现最后一种方案最方便，既不需要计算，也不会影响现有布局，是通用性最强的。于是我就把第四中方案稍微封装了下，做成一个通用函数，代码如下：

    function injectFlash (arg) {
        var config = {
            'wrapId': 'videoCont'
            ,'vid': ''
            ,'w': 500
            ,'h': 300
            ,'auto': 0
        };
        for (var i in arg) {
            arg.hasOwnProperty(i) && arg[i] && (config[i] = arg[i]) ;
        }
    
        function injectSwf (cfg) {
            var swf = '\
                <object id="tenvideo_flash_player_1403119131105" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="' + cfg.w + '" height="' + cfg.h + '">\
                    <param name="Movie" value="http://static.video.qq.com/TencentPlayer.swf?vid='+ cfg.vid +'&autoplay=' + cfg.auto + '&skin=http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf">\
                    <param name="WMode" value="transparent">\
                    <param name="Quality" value="High">\
                    <param name="Scale" value="NoScale">\
                    <param name="AllowFullScreen" value="true">\
                    <param name="AllowScriptAccess" value="always">\
                    <embed type="application/x-shockwave-flash" src="http://static.video.qq.com/TencentPlayer.swf?vid='+ cfg.vid +'&autoplay=' + cfg.auto + '&skin=http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" width="'+ cfg.w + '" height="'+ cfg.h +'" quality="high" wmode="transparent" allowScriptAccess="always" allowFullScreen="true">\
                </object>\
                ';
            document.getElementById(cfg.wrapId).innerHTML = swf ;
        }
    
        function checkNeedFix () {
            if (config.w >= 398 && config.h >= 298) {
                return  ;
            }
            var elTempVideo = document.createElement('div');
            elTempVideo.setAttribute('id', 'alexTempVideoWrap') ;
            elTempVideo.style.cssText = 'position:absolute;bottom:0;right:0;opacity:0;' ;
            document.body.appendChild(elTempVideo) ;
    
            var _config = { 'wrapId': 'alexTempVideoWrap' ,'vid': config.vid ,'w': 398 ,'h': 298 ,'auto': 1 }
            injectSwf(_config);
            setTimeout(function () {
                document.body.removeChild(elTempVideo);
                elTempVideo.innerHTML = ''
            }, 20);
        }
    
        checkNeedFix();
        injectSwf(config);
    }

使用方式：

    /**
     * @param {String} wrapId flash容器的id
     * @param {String} vid 腾讯视频的vid
     * @param {Number} w 视频的宽度
     * @param {Number} h 视频的高度
     * @param {Number} auto 是否自动播放
     **/
    injectFlash({ 'wrapId': 'showplayer' ,'vid': 'xxx' ,'w': 482 , 'h': 297, 'auto': 1 });


如果发现有什么不对的地方，你TM来打我啊。QwQ!

