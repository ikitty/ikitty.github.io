(function (window, output) {
    //supported format: #id || tag.cls || tag || .cls || DOMObject || nodeListObject
    //you can find elements in specify parentNode
    var TG = function(s, parentNodeId) {
        return new TG.fn.init(s, parentNodeId);
    };
    TG.extend = function (o) {
        for (var i in o) {
            (!TG[i]) && (TG[i] = o[i]);
        }
    };
    var rcls = /^(?:([^.]+)|(.+)?\.(.+))$/ ;
    TG.fn = {
        init: function(s, parentNodeId) {
            if (!s) {
                return this ;
            }
            //handle TG('#id') , TG('tag.cls'), TG('tag') , TG('.cls'), TG('.cls', 'id')
            if (typeof s == 'string') {
                var parentNode = parentNodeId ? (document.getElementById(parentNodeId) || document) : document ;

                if (!!document.querySelectorAll) {
                    this.merge(this, parentNode.querySelectorAll(s));
                }else {
                    if (s.indexOf('#') +1) {
                        this[0] = document.getElementById(this.trim(s).replace('#', ''));
                        this.length = 1;
                    //handle  TG('tag') ,TG('tag.cls'),  TG('.cls')
                    //handle  TG('tag', parentNode) ,TG('tag.cls', parentNode),  TG('.cls', parentNode)
                    }else {
                        var m = rcls.exec(s) ;
                        if (!m) {
                            return this ;
                        }
                        if (m[1]) {
                            this.merge(this, parentNode.getElementsByTagName(m[1]))
                        }else if (m[3]){
                            var tag = m[2] || '*' ,
                                el = parentNode.getElementsByTagName(tag),
                                ret = [];
                            for (var i = 0, k ; k = el[i] ; i++ ) {
                                ((' ' + k.className + ' ').indexOf(' ' + this.trim(m[3]) + ' ') > -1) && ret.push(k);
                            }
                            this.merge(this, ret);
                        }
                    }
                }
            //handle TG(nodeListObject)
            }else if (s.length) {
                this.merge(this, s);
            //handle TG(DOMObject)
            }else if(s.nodeType) {
                this[0] = s ;
                this.length = 1;
            //handle TG(function)
            //shortcut for DOMReady
            }else if (Object.prototype.toString.call(s) === '[object Function]'){
                TG.ready(s);
            }
            return this;
        }
        ,length:0
        ,splice: [].splice
        ,merge: function (first, second) {
            var i = first.length ,
                j = 0;

            if (typeof second.length === "number") {
                for (var l = second.length; j < l; j++) {
                    first[i++] = second[j];
                }
            } else {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        }

        ,trim: function (v) {
            v = v || '';
            return !!String.prototype.trim && v.trim() || v.replace(/(^\s+)|(\s+$)/g, '') ;
        }

        ,hasClass:function (v) {
            var s = ' ',
                k ;
            for (var i = 0, l=this.length ; i< l  ; i++ ) {
                k = this[i];
                if (k.nodeType == 1 && ((s + k.className + s).indexOf(s+this.trim(v)+s) + 1)) {
                    return true ;
                }
            }
            return false ;
        }
        ,addClass: function(v) {
            var i, k, l = this.length;
            v = this.trim(v);

            for (i = 0; i < l; i++ ) {
                k = this[i];
                if (k.classList) {
                    k.classList.add(v);
                }else {
                    if ((' ' + k.className + ' ').indexOf(' ' + v + ' ') < 0) {
                        k.className = this.trim(k.className + ' ' + v);
                    }
                }
            }

            return this;
        }
        ,removeClass: function(v) {
            var i, k, l = this.length;
            for (i = 0; i < l; i++ ) {
                k = this[i];
                if (k.classList) {
                    k.classList.remove(v);
                }else {
                    if (k.nodeType === 1 && k.className) {
                        k.className = this.trim((' ' + k.className + ' ').replace(' ' + v + ' ', ' '));
                    }
                }
            }
            return this;
        }
        ,hide: function() {
            for (var i = 0; i < this.length; i++) {
                (this[i].nodeType) && (this[i].style.display = 'none') ; 
            }
            return this;
        }
        ,show: function() {
            for (var i = 0; i < this.length; i++) {
                (this[i].nodeType) && (this[i].style.display = 'block') ; 
            }
            return this;
        }
    };
    TG.fn.init.prototype = TG.fn;

    TG.extend({
        isIE6: !-[1,] && !window.XMLHttpRequest 

        ,addEvent: function (target, eventType, handler) {
            if (target.addEventListener){
                this.addEvent = function(target, eventType, handler){
                    target.addEventListener(eventType, handler, false);
                };
            } else {
                this.addEvent = function(target, eventType, handler){
                    target.attachEvent("on" + eventType, handler);
                };
            }
            this.addEvent(target, eventType, handler);
        }
        ,loadjs: function (url, cb, c) {
            var _head = document.getElementsByTagName("head")[0] || document.documentElement,
                _script = document.createElement("script");
            c && (_script.charset = c );
            _script.src = url;	
            if (cb) {
                if (_script.addEventListener) {
                    _script.addEventListener('load', cb, false);
                } else {
                    _script.onreadystatechange = function() {
                        if (_script.readyState in {loaded: 1, complete: 1}) {
                            _script.onreadystatechange = null;
                            cb();
                        }
                    };
                }
            }
            _head.appendChild( _script );
        }
        ,ready :function (fn) {
            typeof _ready != 'undefined' && _ready(fn);
        }
    });

    //if you think DOMReady is unnecessary, you can remove the '_ready' definition
    var _ready = (function () {
        var readyList = null;
        var isFire = false;

        function fireReady(){
            if(!isFire){
                var fn,i=0;
                if(readyList){
                    while(fn = readyList[i++]){
                        fn();
                    }
                    readyList = null;
                }
                isFire = true;
            }
        }

        function doScrollCheck() {
            if (isFire) { return; }
            try {
                document.documentElement.doScroll("left");
            } catch( error ) {
                setTimeout( doScrollCheck, 1 );
                return;
            }
            fireReady();
        }

        function bindReady(){
            if(document.addEventListener){
                document.addEventListener('DOMContentLoaded', function () {
                    document.removeEventListener('DOMContentLoaded',arguments.callee,false);
                    fireReady();
                }, false);
                window.addEventListener('load',fireReady,false);
            }else if(document.attachEvent){
                document.attachEvent('onreadystatechange',function () {
                    if(document.readyState === 'complete'){
                        document.detachEvent('onreadystatechange',arguments.callee);
                        fireReady();
                    }
                });
                window.attachEvent('onload',fireReady);
            }

            var toplevel = false;
            try {
                toplevel = window.frameElement == null;
            } catch(e) {}

            if ( document.documentElement.doScroll && toplevel ) {
                doScrollCheck();
            }
        }

        bindReady();

        return function (fn) {
            if(!readyList) readyList = [];
            if(document.readyState == 'complete'){
                fn();
            }else{
                readyList.push(fn);
            }
        } ;
    })();    

    window[output || 'TG'] = TG ;
})(window, 'TJ');


var tjEvent = {
    init: function () {
        document.documentElement.addEventListener('touchmove', function(e){
            e.preventDefault();
        });

        var me = this;
        //this.touchCover();
        this.initTab();
    }

    ,touchCover: function () {
        var el = document.getElementById('cover');
        el.addEventListener('touchstart', function () {
            el.addEventListener('touchmove', function () {
                TJ(el).addClass('cover_fadeout');
                TJ('#mobileWrap')[0].style.top = '0';
                el.removeEventListener('touchmove', arguments.callee, false);
            }, false);
        }, false);
    }

    ,initTab: function () {
        var me = this;
        var elNav = document.querySelectorAll('nav p');
        this.mainTab = new m.Slide({
            target: document.querySelectorAll('.frame'),
            onchange: function (v) {
                TJ(elNav).removeClass('on');
                TJ(elNav[v]).addClass('on');
                if (v == 4) {
                    TJ(elNav).hide();
                }else {
                    TJ(elNav).show();
                }
            },
            touchMove: true
        });
    }
};
TJ(function () {
    tjEvent.init();
});

//todo
//wx share 
(function () {
    function onBridgeReady() {
        var mainTitle="《刀锋铁骑》武将风采",
            mainDesc="战争美学新网游《刀锋铁骑》邀您一同欣赏武将风采",
            mainURL="http://t7.qq.com/act/a20140814wxhero/",
            mainImgUrl= "http://ossweb-img.qq.com/images/t7/web201404/super_share.png";

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
            WeixinJSBridge.invoke("shareTimeline", data, function(res) {
                WeixinJSBridge.log(res.err_msg)
            });
        });
        //同步到微博
        WeixinJSBridge.on("menu:share:weibo", function() {
            WeixinJSBridge.invoke("shareWeibo", {
                "content": mainDesc,
                "url": mainURL
            }, function(res) {
                WeixinJSBridge.log(res.err_msg);
            });
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
            }, function(res) {
                WeixinJSBridge.log(res.err_msg)
            });
        });
    };
    //执行
    document.addEventListener('WeixinJSBridgeReady', function() {
        onBridgeReady();
    });
})();
