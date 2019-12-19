// all I did javascript common functions
// update at 2018

var strDOM = '\
        <div id="alexDebug" class="alex_debug hide">\
            test infor
        </div>\
        ';
/**
 * detect zoom
 *
 **/
function detectZoom (){ 
    var ratio = 0,
        screen = window.screen,
        ua = navigator.userAgent.toLowerCase();
    if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
    }
    else if (~ua.indexOf('msie')) {    
        if (screen.deviceXDPI && screen.logicalXDPI) {
            ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
    }
    else if (window.outerWidth !== undefined && window.innerWidth !== undefined) {
        ratio = window.outerWidth / window.innerWidth;
    }

    if (ratio){
        ratio = Math.round(ratio * 100);
    }

    return ratio;
};

//get url arg
function getUrlArg (name, type) {
    var reg=new RegExp("(^|&)"+name+"(?:=([^&]*))?(&|$)"),
        ret ='';
        val=window.location[type || 'search'].slice(1).match(reg);
    return val? (val[2]?unescape(val[2]):""):null;
}

//set hash
function setHash (name, val) {
    var hash = window.location.hash.slice(1);
    hash = hash.split('&');
    for (var i = 0, k = null; k = hash[i] ; i++ ) {
        if (k.indexOf(name+'=') == 0 ) {
            hash.splice( i-- , 1);
        }
    }
    hash.push(name + '=' + val);
    hash = hash.join('&');

    // 所以这里需要检测是否有多余的链接符号
    hash = hash.slice(0, 1) == '&' ? hash.slice(1) : hash ;
    window.location.hash = hash ;
}


var simpleTemplateEngine = function(tpl, data) {
    var re = /{{([^}]+)}}/g;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
};

var renderEvt = function (d) {
    var tpl = document.getElementById('tplEventItem').innerHTML ;
    var activeCont = ''
        ;

    for (var i = 0, k ; k = d['active'][i] ; i++ ) {
        activeCont += simpleTemplateEngine(tpl, k);
    }
    document.getElementById('eventActive').innerHTML = activeCont ;
};

// 检测多键同时按下
var fn  = function (e) {
    e  = event || e ;
    if (e.keyCode == 65 && e.shiftKey){
        tcDebug.run('shift +  A');
    }
} ;
document.onkeyup  = function (e) { fn(e) };


//各种进制的转换
// 其他进制转十进制
// A可以用表述为各进制的值oxF，011 （没法表示二进制了，因为没有二进制没有flag）
// B目标进制
// A.toString(B) 

//解析一个字符串（可以描述自身的进制），返回一个十进制整数，参数B可以用来指定a的进制
// parseInt(a, b) 


/**
 * create class and extend using prototype
 *
 **/
//如果直接使用 child.prototype = parent.prototype ,那么重设prt.const的时候会影响parent的prt.const
//所有这里使用一个空函数作为中转
function extendClass (child, parent) {
    var F = function () { }
    F.prototype = parent.prototype
    child.prototype = new F()
    //上面prt指向的是F的实例，所以这里修改的constructor也不会影响F和parent的prt
    child.prototype.constructor = child
    child.uber = parent.prototype
    return child ;
}
var Base = function  () { this.name ='def'  }
Base.prototype.sayHi = function () { console.log('hi', this.name) ; }

var Child = function (name) { this.name = name || 'nothing' }
extendClass(Child, Base)
var c = new Child('wahah')
c.sayHi()



//创建通用类
var Class = {
    create: function () {
        return function () { this.init.apply(this, arguments); } ;
    }
} ;
// var Xman = Class.create();

var Xman = function () {
    this.init.apply(this, arguments);
};  

Xman.prototype = {
    init: function (arg) {
        this.cfg = {
            name: 'alex'
        };
        for (var i in arg) {
            if (arg.hasOwnProperty(i)) { this.cfg[i] = arg[i]; }
        }
    }
    ,say: function () {
        console.log(this.cfg.name) ;
    }
};

var x1 = new Xman({'name': 'x1'});
var x2 = new Xman({'name': 'x2'});
x1.say();
x2.say();

/**
 * @description handle mousewheel
 * @param {Object} arg1 指定注入的对象，可以填window或者其他
 * @param {String} arg2 组件名称，你写成啥，后面就调用啥，默认是handleWheel
 * @param {Number} arg3 时间系统，组件中模拟了underscore的throttle特性，以避免事件的频繁触发,据统计，100ms是很合适的
 **/
//debounce 只处理一段时间内的最后一个事件
(function (w, modName,time) {
    var st
        ,modName = modName || 'handleWheel'
        ,time = time || 100
        ;
    function getWheelDir(e) {
        var delta = 0;
        e =window.event || e;

        if (e.wheelDelta) {
            delta = e.wheelDelta/120; 
        } else if (e.detail) {
            delta = -e.detail/3;
        }
        return delta ;
    }

    w[modName] = function (doUp, doDown) {
        function _handleWheel(e) {
            st && clearTimeout(st);
            var dir = getWheelDir(e);

            st = setTimeout(function () {
                if (dir >0) {
                    (typeof doUp == 'function') && doUp()
                }else {
                    (typeof doDown == 'function') && doDown()
                }
            }, time);
        }
        window.onmousewheel = document.onmousewheel = _handleWheel;
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', _handleWheel, false);
        }
    }
})(window, 'handleWheel', 100);

//another version
//throttle，一定时间内只执行一次
(function (w, modName, time) {
    var st
        ,modName = modName || 'handleWheel'
        ,_run  = 1
        ,time = time || 100
        ;
    function getWheelDir(e) {
        var delta = 0;
        e =window.event || e;
 
        if (e.wheelDelta) {
            delta = e.wheelDelta/120; 
        } else if (e.detail) {
            delta = -e.detail/3;
        }
        return delta ;
    }
 
    w[modName] = function (doUp, doDown) {
        function _alexHandleWheel(e) {
            if (_run) {
                _run = 0;
                setTimeout(function () {
                    _run = 1;
                }, time);

                var dir = getWheelDir(e);
 
                if (dir >0) {
                    (typeof doUp == 'function') && doUp()
                }else {
                    (typeof doDown == 'function') && doDown()
                }
            }
        }
        window.onmousewheel = document.onmousewheel = _alexHandleWheel;
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', _alexHandleWheel, false);
        }
    }
})(window, 'handleWheelAnother', 100);

//test
handleWheel(function () {
    console.log('up') ;
}, function () {
    console.log('down') ;
});

// deprecated code for IE
//if (img.complete) {
    //i++;
    //_handle_once(Math.ceil(100 * i / _len));
    //_load(i);
    //img = null;
//}else {
    //img.onreadystatechange = function() {
        //if (img.readyState in {loaded: 1, complete: 1}) {
            //img.onreadystatechange = null;
            //i++;
            //_handle_once(Math.ceil(100 * i / _len));
            //_load(i);
            //img = null;
        //}
    //};
//}

/**
 * preload image
 * only support addEventListener
 * support insert img to page for cache , even return these img for canvas 
 **/
(function (win) {
    var elTemp = document.createDocumentFragment() ;
    var imgArr= []
    var _loadImg = function(src, handle_once, handle_done ,isInsert, retImg) {
        var _len = src.length ;
        var _load = function( i ) {
            if (i >= _len) {
                retImg['msg'] = imgArr;
                document.body.appendChild(elTemp) ;
                handle_done();
                return ;   
            }
            var img = new Image();
            img.src = src[i];

            if (window.addEventListener) {
                img.addEventListener('load', function () {
                    isInsert && insertPage(i);
                    i++;
                    _handle_once(Math.ceil(100 * i / _len));
                    _load(i);
                    img = null;
                }, false);
            } else {
                handle_done(); return  ;
            }
        }

        var insertPage = function (i) {
            var pageImg = document.createElement('img');
            pageImg.src = src[i];
            pageImg.style.display = 'none'; 
            elTemp.appendChild(pageImg) ;
            imgArr.push(pageImg);
        };

        var totalNum = 0 ;
        var stHandleOnce ; 
        //used for hold last process
        var lastN = 0 ;
        var _handle_once = function (n) {
            stHandleOnce && clearTimeout(stHandleOnce);
            //如果有新的进度,立即将当前进度切换为上一次的最终进度,并记录当前进度
            if (lastN !== n) {
                totalNum = lastN ;
                lastN = n ;
            }

            (function run() {
                if (totalNum < n && totalNum < 100) {
                    handle_once(++totalNum);
                    stHandleOnce = setTimeout(function () {
                        run();
                    }, 20);
                }
            })();
        }
        _load(0);
    };

    var loadImg= function (imgs, prefix, cb, cbAll, isInsert, retImg) {
        for (var i = 0, k = null; k = imgs[i] ; i++ ) { imgs[i] = prefix + k; }
        _loadImg(imgs, function (n) { cb(n); }, function () { cbAll(); }, isInsert || 0, retImg);
    };
    win.loadImg = loadImg;
})(window);

//preload using
//var imgs = [ 'loading.png' ,'m1.png' ,'m2.png' ,'m2_role.png' ,'m3.png' ,'m4.png' ];
//var gtimgPrefix = 'images/' ;
//var imgsObj = {};
//loadImg(imgs, gtimgPrefix , function (n) { console.log(n) ; }, function () { 
    //console.log('down all', imgsObj.msg) ;
//}, 1, imgsObj  );

//CSS
    //.preload_wrap {width:800px;height:30px;position:absolute;top:30px;left:50%;margin-left:-400px;border:2px solid #000;background-color:#fff;}
    //.preload_wrap p {height:100%;background-color:#f60;width:1%;}
//DOM
    //<div class="preload_wrap"> <p class="preload" id="preload"></p> </div>

//random number in specify range and Precision
var alexRand = function (min, max, digit) {
    var r = Math.random()*(max-min) + min ;
    return digit ? Number(r.toFixed(digit)) : (r | 0) ;
};


/**
 * RAF
 * @usingRAF RAF(render) ; or LoopRAF(anim)
 * @cancelRAF CAF(render)
 *
 **/
(function (win) {
    win.RAF = (function(){
        return win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || win.oRequestAnimationFrame || win.msRequestAnimationFrame || function (callback) {win.setTimeout(callback, 1000 / 60); };
    })();
    win.CAF = function(render) {
        var _caf = win.cancelAnimationFrame || win.webkitCancelRequestAnimationFrame || win.mozCancelRequestAnimationFrame || win.oCancelRequestAnimationFrame || win.msCancelRequestAnimationFrame        || clearTimeout ;
        _caf(render._timer);
    };
    win.LoopRAF = function (render) {
        (function _loop(){
            render();
            render._timer = RAF(_loop); 
        })();
    };
})(window);


//debug
var debug = function (v) {
    if (!document.getElementById('alexLog')) {
        var elRet = document.createElement('div');
        elRet.id = 'alexLog';
        $$(elRet).css({
            position:'absolute'
            ,top:100
            ,right:20
            ,background: 'green'
            ,color: '#fff'
            ,padding:'2px 5px'
            ,'text-align': 'right'
        });
        document.body.appendChild(elRet) ;
    }
    $$('#alexLog').append(  v + '<br>');
};

//scroll no bounce
//id可以为指定滚动容器的DOM ID
var scrollNoBounce= function (id) {
    var beginY, endY;
    $(window).on('touchstart',  function (e) {
        beginY = e.originalEvent.touches[0].screenY ;
    });

    $(window).on("touchmove", function (e) {
        var elScroll = document.getElementById(id) || document.body ;
        if (e.target !== elScroll && !elScroll.contains(e.target)) {
            e.preventDefault();
        }
        
        endY =  e.originalEvent.touches[0].screenY;
        if (elScroll.scrollTop === 0 && endY >= beginY) {
            e.preventDefault();
        }

        var elScrollViewHeight = id ? elScroll.clientHeight : document.documentElement.clientHeight ;
        if (elScroll.scrollHeight - elScrollViewHeight === elScroll.scrollTop && beginY >= endY) {
            e.preventDefault();
        }
    });
};

/**
 * simple Slider by alex
 * @require self jquery
 * @require self jquery ext : alexSwipe
 * @version 1.0
 *
 **/
//==================slider==============================
var Slider = function (arg) {
    this.triggerId = '';
    this.contId = '';
    this.time = 3000;
    this.type = 'click';
    this.touch = 0 ;
    this.makeTrig = 1;
    this.prevId = '';
    this.nextId = '';
    
    this.auto = 1;
    this.$elBody = null; 
    this.current = 0 ;
    this.elTrigger = null;
    this.timer = null; 
    this.last = this.current;

    for (var i in arg) {
        (i in this) && (this[i] = arg[i]) ;
    }
    this.init();
};
Slider.prototype = {
    init: function () {
        if (!this.contId || !this.triggerId) { return  ; }
        this.$elBody = $('#' + this.contId)
        this.$elBody.css('width', 100*this.count + '%')
        this.count = this.$elBody.children().length 

        this.makeTrig && this.createTrigger();
        this.doClick();
        this.elTrigger[this.current].className = 'on';

        this.auto && this.autoPlay() ;
        this.touch && this.handleTouch();

        var self = this;
        $('#'+this.prevId).on('touchstart', function () { self.prev() })
        $('#'+this.nextId).on('touchstart', function () { self.next() })
    }
    ,play: function (order) {
        if (order>=this.count || order <0) {
            order = 0 ;
        }
        this.$elBody.css('left', -100*order +'%' )
        this.current = order ;

        this.elTrigger[this.last].className = '';
        this.elTrigger[this.current].className = 'on';
        this.last = this.current ;
    }
    ,autoPlay: function () {
        var me = this;
        var _run = function () {
            me.timer = setTimeout(function () {
                if (me.auto) {
                    me.play(++me.current);
                    _run();
                }
            }, me.time);
        };
        _run();
    }
    ,pause: function () {
        clearTimeout(this.timer);
        this.timer = null ;
    }
    ,doClick: function () {
        var me = this; 
        this.elTrigger = document.getElementById(this.triggerId).getElementsByTagName('i') ;

        for (var i = 0, k, le = this.elTrigger.length ; i < le; i++ ) {
            k = this.elTrigger[i];
            k.order = i ;
            k['on' + me.type]= function () {
                me.play(this.order);
            }
        }
    }

    ,createTrigger: function () {
        document.getElementById(this.triggerId).innerHTML = (new Array(this.count+1)).join('<i></i>') ;

        var me = this;
        //todo should move to doClick
        //disable feature on mobile
        if (this.touch) { return  ; }
        document.getElementById(this.triggerId).onmouseover = function () { me.pause(); };
        document.getElementById(this.triggerId).onmouseout = function () { me.autoPlay(); };
    }
    ,handleTouch: function (dir) {
        var me = this ;
        this.$elBody.alexSwipe(function (dir) {
            if (dir === 'left') {
                me.next();
            }else if (dir === 'right'){
                me.prev();
            }
        })
    }
    ,prev: function () {
        this.pause();
        this.current--;
        this.play(this.current);
        this.autoPlay();
    }
    ,next: function () {
        this.pause();
        this.current++;
        this.play(this.current);
        this.autoPlay();
    }
};
//var mainSlider = new Slider({
    //triggerId: 'sliderBtn'
    //,contId: 'sliderList'
    //,time: 2500
    //,type: 'click'
    //,touch: 1
//});

/* =====swipe===== */
//require jquery or zepto
$.fn.alexSwipe = function (fn) {
    fn = fn || function(){};
    var dir = 'down' ;
    var _startX = 0 
        ,_startY = 0 
        ,_moveX = 0 
        ,_moveY = 0 
        ;

    $(this).on('touchstart', function (e) {
        var touch = (e.touches || e.originalEvent.touches)[0] 
        _startX = touch.clientX;
        _startY = touch.clientY;
    });
    $(this).on('touchmove', function (e) {
        //e.preventDefault();
        //e.stopPropagation();

        var touch = (e.touches || e.originalEvent.touches)[0] 
        _moveX = touch.clientX - _startX;
        _moveY = touch.clientY - _startY;
    });
    $(this).on('touchend', function (e) {
        var absMoveY = Math.abs(_moveY) 
            ,absMoveX = Math.abs(_moveX)
            ,xMove = 1
            ;
        xMove = (absMoveX > absMoveY ? 1 : 0)

        if (absMoveX > 30 && xMove){
            dir = _moveX > 0 ? 'right' : 'left'
            fn(dir);
        }else if (absMoveY > 30){
            dir = _moveY > 0 ? 'down' : 'up'
            fn(dir);
        }
        _moveX = 0 ;
        _moveY = 0 ;
    });
}

/* =====System Copy ===== */
$('#btnCopyLink').on('click', function () {
    var elTxt = document.getElementById('txtLink');
    elTxt.select();
    //如果在没有select内容的情况下，直接测试copy命令，会返回false。
    if (document.execCommand('copy')) {
        $$.showTips({msg: '复制成功'}) ;
    }else {
        $$.showTips({msg: '请手动复制链接'}) ;
    }
});


/**
 * pageVisibleChange
 *
 * @example pageVisibleChange((hidden)=> {console.log(hidden)})
 **/
(function (win) {
    var hidden, visibilityChange; 
    if (typeof document.hidden !== "undefined") { 
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    }

    var pageVisibleChange = function (cb) {
        if (document.addEventListener && typeof document[hidden] !== "undefined") {
            document.addEventListener(visibilityChange, function () { cb(document[hidden]); }, false);
        }
    };

    win.pageVisibleChange = pageVisibleChange;
})(window);

//injectTCVideo
// var v1 = new injectVideo({vid: 'q0507tpxnr5', id: 'vd1' })
// var v2 = new injectVideo({vid: 'i0023dlxwnb', id: 'vd2' })
var injectVideo = function (obj) {
    this.retVideo = ''
    this.config = {
        boxId: '',
        vid: '',
        autoplay: false,
        callback: function () { }
    }
    for (var i in obj) { this.config[i] = obj[i] }
    this.init()
};
injectVideo.prototype = {
    init: function () {
        var self = this
        window['insertMv_'+ this.config.vid ] = function (D) {
            var retVi = D.vl.vi[0]
            var prefix = retVi.ul.ui[0].url ,
                name = retVi.fn,
                vkey = retVi.fvkey;
            var src = prefix + name + '?vkey=' + vkey

            var elVideo = document.createElement('video')
            elVideo.setAttribute('src',  src) ;
            self.config.autoplay && elVideo.setAttribute('autoplay', true) ;
            document.getElementById(self.config.id).appendChild(elVideo) ;

            self.retVideo = elVideo
            self.config.callback && self.config.callback() 
        }
        this.setVideo()
    },
    setVideo: function () {
        var url='http://vv.video.qq.com/getinfo?vids='+this.config.vid+'&platform=1&charge=0&otype=json&defaultfmt=fhd&sb=0&nocache=0&callback=insertMv_' + this.config.vid;
        $.getScript(url)
    }
}
        
//fullScreen player
function fullScreenPlayer(trigId, vid){
    var elVideo = document.createElement('section')
    var elVideoClose = document.createElement('i')
    elVideoClose.innerText = '×'
    $('body').append(elVideo)
    $('body').append(elVideoClose)
    $(elVideo).attr('id', 'fsVideo');
    $(elVideoClose).attr('id', 'fsVideoClose');

    $(elVideo).css({width:'100%',height:'100%',position:'fixed',top:0,left:0,zIndex:9999,background:'#000',display:'none'});
    $(elVideoClose).css({font:'700 24px/32px Arial',width:'32px', height:'32px',color:'#aaa',textAlign:'center', position:'fixed',top:'2%',right:'2%',zIndex:9999,display:'none'});

    var video = new tvp.VideoInfo();
    video.setVid(vid);
    var player =new tvp.Player();
    player.create({
        width:"100%",
        height:"100%",
        video:video,
        modId: 'fsVideo',
        onfullscreen:function(f){if(!f){$("#fsVideo, #fsVideoClose").hide()}},
        isHtml5UseAirPlay:true,
        isHtml5UseFakeFullScreen:true,
        autoplay:false
    });
    $('#'+trigId).on('touchstart',function(){
        player.play();
        $("#fsVideo,#fsVideoClose").show();
    });
    $("#fsVideoClose").on('touchstart',function(){
        player.pause();
        setTimeout(function(){$("#fsVideo,#fsVideoClose").hide()}, 300);
    });
}
//using
$.getScript('http://imgcache.gtimg.cn/tencentvideo_v1/tvp/js/tvp.player_v2_zepto.js', function(){
    fullScreenPlayer('btnPlay','w0526qhtaat');
});

//qq链接转码所需字段
//<meta itemprop="name" content="四海八荒第一美人评选"/>
//<meta itemprop="image" content="http://ossweb-img.qq.com/images/chanpin/xycq/cp/a20170804beautym/share.png" />
//<meta itemprop="description" content="洪荒世界美人多 参赛送花疯抢惊喜壕礼" />

//share
//<script src="//open.mobile.qq.com/sdk/qqapi.https.js"></script>
(function () {
    var shareData = {
        title: '四海八荒第一美人评选',
        desc: '洪荒世界美人多 参赛送花疯抢惊喜壕礼',
        img: 'http://ossweb-img.qq.com/images/chanpin/xycq/cp/a20170804beautym/share.png',
        link: location.href,
        actName: 'a20170804beautym'
    };
    //wx
    function onBridgeReady() {
        var mainTitle= shareData.title,
            mainDesc= shareData.desc,
            mainURL=shareData.link,
            mainImgUrl= shareData.img;

        //转发朋友圈
        WeixinJSBridge.on("menu:share:timeline", function(e) {
            var data = {
                img_url:mainImgUrl,
                img_width: "120",
                img_height: "120",
                link: mainURL,
                desc: mainDesc,
                title: mainTitle
            };
            WeixinJSBridge.invoke("shareTimeline", data, function(res) { WeixinJSBridge.log(res.err_msg) });
        });
        //分享给朋友
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke("sendAppMessage", {
                img_url: mainImgUrl,
                img_width: "120",
                img_height: "120",
                link: mainURL,
                desc: mainDesc,
                title: mainTitle
            }, function(res) { WeixinJSBridge.log(res.err_msg) });
        });
    };
    document.addEventListener('WeixinJSBridgeReady', function() { onBridgeReady(); });

    //qq
    try {
        mqq.ui.setOnShareHandler(function(type){
            mqq.ui.shareMessage({
                share_url: shareData.link,
                title: shareData.title,
                desc: shareData.desc,
                image_url:shareData.img,
                share_type:type
            },
            function(retCode){pgvSendClick({hottag:shareData.actName+'.qq.'+retCode});})
        });
    }catch (e){}
})()

// v console
//<script src="https://res.wx.qq.com/mmbizwap/zh_CN/htmledition/js/vconsole/2.5.1/vconsole.min.js"></script>

// =============================
// ========List Class show =====
// =============================
<script type="text/template" id="tplVlog">
    <li>
        <a class="va_lk" data-vid="{{vid}}" href="javascript:;"><img src="{{imgPrefix}}{{img}}" /></a>
        <p class="va_tit">{{title}}</p>
    </li>
</script>
<script type="text/template" id="tplTongren">
    <li>
        <a class="va_lk" href="javascript:;"><img src="{{imgPrefix}}{{img}}" /></a>
        <p class="va_tit">{{title}}</p>
    </li>
</script>

var simpleTemplateEngine = function(tpl, data) {
    var re = /{{([^}]+)}}/g;
    while(match = re.exec(tpl)) {
        tpl = tpl.replace(match[0], data[match[1]])
    }
    return tpl;
};
function firstUp(str) {
    return str.replace(/^\S/g, function(s){return s.toUpperCase();});
}

var vaData = {};
vaData.wallpaper = Array(30)
vaData.video= [
    { title:'御心而行，自由探索', img: 'video7.jpg', vid: 'p0632f2nexa'},
    { title:'超凡世界，大有可观', img: 'video8.jpg', vid: 'x0632i7n1gi'}
]
vaData.tongren= [
    { title:'敬请期待', img: 'tr1.jpg'}
];

// list Class
var listShow = function (obj) {
    var count = obj.D[obj.type].length
    this.type = obj.type
    this.size = obj.size
    this.total = Math.ceil(count / this.size)
    this.last = count % this.size
    this.curPage = 1
    this.$pager = obj.$pager
    this.init()
}
listShow.prototype = {
    init: function () {
        var size = this.curPage == this.total ? this.last : this.size
        this.renderList(0, size)
        this.doPage()
        this.renderPager()
    },

    renderList: function (start, size) {
        var imgPrefix = '//game.gtimg.cn/images/xylz/web201808/media/';
        var tpl = document.getElementById('tpl' + firstUp(this.type)).innerHTML ;
        var len = start + size 
        var D = (vaData[this.type] || []).slice(start, len)
        // console.log(this.type, start, size, D) ;
        var ret = ''
        for (var i = start, ii = 0; i < len ; i++ ) {
            var tmp = D[ii++] || {}
            var tmpData = {imgPrefix: imgPrefix, id: (i+1), title: tmp.title, img: tmp.img, vid: tmp.vid}
            ret += simpleTemplateEngine(tpl, tmpData);
        }
        document.getElementById(this.type + 'List').innerHTML = ret 
        
    },
    doPage: function () {
        var self = this
        this.$pager.on('click', function () {
            var v = $(this).index()
            if (v === 0) {
                self.curPage--
            }else {
                self.curPage++
            }
            if (self.curPage < 1) {
                self.curPage = 1
                return  ;
            }
            if (self.curPage > self.total) {
                self.curPage = self.total
                return ;
            }

            var size = self.size
            if (self.curPage === self.total) {
                size = self.last
            }
            self.renderList((self.curPage - 1)*self.size , size)
            self.renderPager()
        })
    },
    renderPager: function () {
        this.$pager.show()
        if (this.curPage === 1) {
            this.$pager.eq(0).hide()
        }
        if (this.curPage === this.total) {
            this.$pager.eq(1).hide()
        }
    }
}
new listShow({D: vaData, type: 'wallpaper', size: 9 , $pager: $('a[data-wlpager]')})
new listShow({D: vaData, type: 'tongren', size: 9 , $pager: $('a[data-trpager]')})
