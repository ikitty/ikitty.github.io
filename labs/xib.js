// all I did javascript common functions

var strHTML += '\
                <li>\
                   <p class="mo_name">' + kk.name + '</p>\
                </li>\
                ';
/**
 * simple Tab by alex
 *
 * @param {object HTMLCollection} obj.hd , tab trigger elements
 * @param {object HTMLCollection} obj.bd , tab content elements
 * @param {String} obj.hdActiveCls , tab trigger active className
 * @param {String} obj.bdActiveCls , tab content active className
 * @param {Number} obj.def , default item index
 * @param {String} obj.mode , trigger type, 'click' or 'mouseover'
 **/
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
    TJ(cfg.hd[cfg.def]).addClass(cfg.hdActiveCls);
    TJ(cfg.bd[cfg.def]).addClass(cfg.bdActiveCls);

    for (var i = 0, k ; k = cfg.hd[i] ; i++ ) {
        k.index = i ;
        k[cfg.mode] = function () {
            TJ(cfg.hd[cfg.def]).removeClass(cfg.hdActiveCls);
            TJ(cfg.hd[this.index]).addClass(cfg.hdActiveCls);

            TJ(cfg.bd[cfg.def]).removeClass(cfg.bdActiveCls);
            TJ(cfg.bd[this.index]).addClass(cfg.bdActiveCls);
            cfg.def = this.index;

            cfg.callback && (typeof cfg.callback == 'function') && cfg.callback(this.index);
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
}    

var renderEvt = function (d) {
    var tpl = document.getElementById('tplEventItem').innerHTML ;
    var activeCont = ''
        ,overdueCont = ''
        ;

    for (var i = 0, k ; k = d['active'][i] ; i++ ) {
        activeCont += simpleTemplateEngine(tpl, k);
    }
    document.getElementById('eventActive').innerHTML = activeCont ;
    for (var i = 0, k ; k = d['overdue'][i] ; i++ ) {
        overdueCont += simpleTemplateEngine(tpl, k);
    }
    document.getElementById('eventOverdue').innerHTML = overdueCont ;
}

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

var Xman = Class.create();
Xman.prototype = {
    config: {
        name:'alex'
        ,'age': 18
    }
    ,init: function (arg) {
        //instance config
        this.cfg = {};
        for (var i in arg) {
            if (arg.hasOwnProperty(i)) {
                this.cfg[i] = arg[i];
            }
        }
    }
    ,say: function () {
        console.log('hi girls', this.cfg.name, this.config.age) ;
    }
}

var x1 = new Xman({'name': 'x1'});
var x2 = new Xman({'name': 'x2'});
x1.say();
x2.say();

//handle mousewheel
(function (w, modName) {
    var st
        ,modName = modName || 'handleWheel'
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
            }, 80);
        }
        window.onmousewheel = document.onmousewheel = _handleWheel;
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', _handleWheel, false);
        }
    }
})(window);
//test
handleWheel(function () {
    console.log('up') ;
}, function () {
    console.log('down') ;
})