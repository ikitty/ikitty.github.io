// all I did javascript common functions

var str = '';
    str += '\
            <li>\
               <p class="mo_name">' + location.href + '</p>\
            </li>\
            ';
/**
 * simple Tab by alex
 * @require self jquery
 * @version 1.0
 *
 * @param {object HTMLCollection} obj.hd , tab trigger elements
 * @param {object HTMLCollection} obj.bd , tab content elements
 * @param {String} obj.hdActiveCls , tab trigger active className
 * @param {String} obj.bdActiveCls , tab content active className
 * @param {Number} obj.def , default item index
 * @param {String} obj.mode , trigger type, 'click' or 'mouseover'
 **/
//todo using jq insteed
var alexTab = function (obj) {
    var cfg = {
        hd: null
        ,bd: null
        ,hdActiveCls: 'active' 
        ,bdActiveCls: 'active' 
        ,def: 0
        ,mode: 'click'
        ,callback: 0
    };
    for (var i in obj) {
        obj[i] && (cfg[i] = obj[i]) ;
    }
    cfg.mode = 'on' + cfg.mode;

    if (!cfg.hd || !cfg.bd) {
        return  ;
    }
    //init
    $$(cfg.hd).removeClass(cfg.hdActiveCls);
    $$(cfg.hd[cfg.def]).addClass(cfg.hdActiveCls);
    $$(cfg.bd).removeClass(cfg.bdActiveCls);
    $$(cfg.bd[cfg.def]).addClass(cfg.bdActiveCls);

    for (var i = 0, k ; k = cfg.hd[i] ; i++ ) {
        k.index = i ;
        k[cfg.mode] = function () {
            $$(cfg.hd[cfg.def]).removeClass(cfg.hdActiveCls);
            $$(cfg.hd[this.index]).addClass(cfg.hdActiveCls);

            $$(cfg.bd[cfg.def]).removeClass(cfg.bdActiveCls);
            $$(cfg.bd[this.index]).addClass(cfg.bdActiveCls);

            cfg.callback && (typeof cfg.callback == 'function') && cfg.callback(this.index, cfg.def);

            cfg.def = this.index;
        }
    }
};

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

//get hash
function getHash (name) {
    var reg=new RegExp("(^|)"+name+"(?:=([^&]*))?(&|$)"),
        ret ='';
        val=window.location.hash.slice(1).match(reg);
    return val? (val[2]?unescape(val[2]):""):null;
}

//set hash
function setHash (name, val) {
    var hash = window.location.hash.slice(1);
    //如果hash为空，依然会split包含一个空值的数组
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
document.onkeyup  = function (e) {
    fn(e)
};


//各种进制的转换
// 其他进制转十进制
// A可以用表述为各进制的值oxF，011 （没法表示二进制了，因为没有二进制没有flag）
// B目标进制
// A.toString(B) 

//解析一个字符串（可以描述自身的进制），返回一个十进制整数，参数B可以用来指定a的进制
// parseInt(a, b) 


//创建通用类
var Class = {
    create: function () {
        return function () {
            this.init.apply(this, arguments);
        } ;
    }
} ;

// var Xman = Class.create();
var Xman = function () {
    this.init.apply(this, arguments);
};  

Xman.prototype = {
    config: {
        name:'alex'
        ,'age': 18
    }
    ,init: function (arg) {
        //动态在this上写入的对象是实例私有的，而this.config是指向prototype中的，各个实例共享

        //pre setting
        this.isNice = 1 ;
        this.isBeauty = 1 ;

        //custom config
        this.cfg = {};
        for (var i in arg) {
            if (arg.hasOwnProperty(i)) {
                this.cfg[i] = arg[i];
            }
        }
    }
    ,say: function () {
        console.log(this.cfg) ;
    }
};

var x1 = new Xman({'name': 'x1'});
var x2 = new Xman({'name': 'x2'});
// x1.say();
// x2.say();
// x1.say();

//handle mousewheel
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

/**
 * @param {Object} arg1 指定注入的对象，可以填window或者其他
 * @param {String} arg2 组件名称，你写成啥，后面就调用啥，默认是handleWheel
 * @param {Number} arg3 时间系统，组件中模拟了underscore的throttle特性，以避免事件的频繁触发,据统计，100ms是很合适的
 **/

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
 * @version 1.0
 *
 * @param {Number} obj.sliderWidth 
 * @param {Number} obj.count , the amount of slider child 
 * @param {HTMLElement} obj.elBody , slider content DOM
 * @param {Bool} obj.autoCreateTrigger 
 * @param {String} obj.triggerTagName , define trigger tag name
 * @param {Number} obj.time , animation interval time
 **/
//==================slider==============================
//todo opt args
//todo add touch support
var Slider = function (arg) {
    this.sliderWidth = 500;
    this.count = 5;
    this.triggerId = '';
    this.elBody = null;
    this.autoCreateTrigger = false ;
    this.triggerTagName = 'a' ;

    this.time = 3000;
    this.type = 'click';
    this.auto = 1;
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
        this.createTrigger();

        this.auto && this.autoPlay() ;
        this.play(this.current);
        //this.elTrigger[this.current].className = 'on';
    }
    ,play: function (order) {
        order = order >= this.count ? 0 : order ;
        this.elBody.style.left = -1*order*this.sliderWidth  +'px' ;
        this.syncStatus(order);

        this.elTrigger[this.last].className = '';
        this.elTrigger[this.current].className = 'on';
        this.last = this.current ;
    }
    ,syncStatus: function (order) {
        this.current = order ;
    }
    ,autoPlay: function () {
        var me = this;
        var _run = function () {
            me.timer = setTimeout(function () {
                _run();
                if (me.auto) {
                    me.play(++me.current);
                }
            }, me.time);
        };
        _run();
    }
    ,pause: function () {
        clearTimeout(this.timer);
        this.timer = null ;
    }
    ,listenEvent: function () {
        var me = this; 
        this.elTrigger = document.getElementById(this.triggerId).getElementsByTagName(this.triggerTagName) ;

        for (var i = 0, k, le = this.elTrigger.length ; i < le; i++ ) {
            k = this.elTrigger[i];
            k.order = i ;
            k['on' + me.type]= function () {
                me.play(this.order);
            }
        }

        document.getElementById(this.triggerId).onmouseover = function () {
            me.pause();
        };
        document.getElementById(this.triggerId).onmouseout = function () {
            me.autoPlay();
        };
    }

    ,createTrigger: function () {
        if (this.autoCreateTrigger) {
            var tagName = this.triggerTagName ;
            document.getElementById(this.triggerId).innerHTML = (new Array(this.count+1)).join('<' + tagName + '></' + tagName + '>') ;
        }
        this.listenEvent();
    }
};

/**
 * debounce 单位时间内只触发最后一个事件
 *
 * @param {DOM} target : event trigger DOM
 * @param {String} eventType
 * @param {Fucntion} fn : event callback
 * @param {Number} time : debounce time
 **/
var alexDebounce = function (obj ) {
    var cfg = {
        fn: function(){}
        ,target: ''
        ,eventType: ''
        ,time: 100
    };
    for (var i in obj) {
        obj[i] && (cfg[i] = obj[i]) ;
    }

    st = '';

    if (!!window.addEventListener) {
        cfg.target.addEventListener(cfg.eventType, function () {
            st && clearTimeout(st);
            st = setTimeout(function () {
                cfg.fn();
            }, cfg.time);
        }, false);
    }else {
        cfg.target.attachEvent('on'+ cfg.eventType, function () {
            st && clearTimeout(st);
            st = setTimeout(function () {
                cfg.fn();
            }, cfg.time);
        });
    }
};

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
        var touch = e.touches[0];
        _startX = touch.clientX;
        _startY = touch.clientY;
    });
    $(this).on('touchmove', function (e) {
        e.preventDefault();
        e.stopPropagation();
        e.cancelBubble = true;

        var touch = e.touches[0];
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
})


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
