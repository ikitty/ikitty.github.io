//auto height
var ua = navigator.userAgent.toLowerCase();
var isMobile = (/android|webos|iphone|ipod|blackberry|ieiMobile|opera mini/i.test(this.ua)) ;

// require common loadImg
var loadImg = function(src, handle_once, handle_done) {
    var _len = src.length ;
    var _load = function( i ) {
        if (i >= _len) {
            handle_done();
            return  ;   
        }
        
        var img = new Image();
        img.src = src[i];
        if (img.complete) {
            i++;
            handle_once(Math.ceil(100 * i / _len));
            _load(i);
            img = null;
        } else {
            img.addEventListener('load', function () {
                i++;
                handle_once(Math.ceil(100 * i / _len));
                _load(i);
                img = null;
            }, false);
        }
    }
 
    _load(0);
};

var loadImgCustom = function (imgs, prefix, cb, cbAll, debug) {
    prefix = !!debug ? 'images/' : prefix;
    for (var i = 0, k = null; k = imgs[i] ; i++ ) {
        imgs[i] = prefix + k;
    }
    loadImg(imgs, function (n) {
        cb(n);
    }, function () {
        cbAll();
    });
};

//todo mobileBox , pcBox hide
//todo body本身没有cls hook，根据情况动态添加cls
if (isMobile) {
    TJ('#mobileBox').show();

    //set size
    (function () {
        var h = window.innerHeight ;
        TJ('#cover')[0].style.height = h + 'px';
        TJ('#mobileWrap')[0].style.height = h + 'px';
    })();

    //preload
    var imgs = [
        'loading.png'
        ,'mbg1.jpg' ,'mbg2.jpg' ,'mbg4.jpg' ,'mbg5.jpg'
        ,'m1.png' ,'m2.png' ,'m2_role.png' ,'m3.png' ,'m4.png'
    ];
    loadImgCustom(imgs, 'http://ossweb-img.qq.com/images/t7/act/a20141117suspense/', function (n) {
        document.getElementById('preloadNum').innerHTML = n ;
        document.getElementById('preloadStatus').style.height = n + '%';
    }, function () {
        TJ('#cover').addClass('cover_fadeout');
        TJ('body').addClass('client_mobile');
        setTimeout(function () {
            TJ('#cover').hide();
        }, 1000);
    }, 1)

    //TE.init
    var Te = {
        init: function () {
            document.documentElement.addEventListener('touchmove', function(e){
                e.preventDefault();
            });
            this.initTab();
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
        Te.init();
    });

    //wx share 
    (function (o) {
        function onBridgeReady() {
            var mainTitle= o.title ,
                mainDesc= o.desp,
                mainURL= o.url,
                mainImgUrl= o.img || "http://ossweb-img.qq.com/images/t7/web201404/super_share.png";

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
        document.addEventListener('WeixinJSBridgeReady', function() { onBridgeReady(); });
    })({
        title: '《刀锋铁骑》武将风采'
        ,desp: '战争美学新网游《刀锋铁骑》邀您一同体验'
        ,url: 'http://t7.qq.com/act/a20141115suspense/'
        ,img: 'http://ossweb-img.qq.com/images/t7/web201404/super_share.png'
    });
}else {
    TJ('#pcBox').show();
    //todo isMordenBrowser
    var isMordenBrowser = (function () {
        var ua = navigator.userAgent;
        if (/msie/i.test(ua)) {
            var ieV = ua.match(/msie ([\d.]+)/)[1];
            return ieV > 9 ? 1 : 0 ;
        }
        

        var props = 'transform perspective transition'.split(' ');
        var _style = document.createElement('p').style ;
        var _k ;
        for (var i = 0, k ; k = props[i] ; i++ ) {
            _k = 'webkit' + k.replace(/^[a-z]/, function (v) {
                return v.toUpperCase() ;
            });

            if (!(k in _style) && !(_k in _style)) {
                return 0 ;
            }
            return 1 ;
        }
    })();

    if (isMordenBrowser) {
        //set size
        (function () {
            var el = document.getElementById('cubicZone');
            var _setH = function () {
                var otherH = 177 
                    ,bodyH = document.documentElement.clientHeight 
                    ,h
                    ;
                h = bodyH - otherH ;
                h = h > 1000 ? 1000 : h ;
                el.style.height = h + 'px';
                if (h < 680) {
                    TJ('div.stage_wrap').addClass('stage_wrap_scale');
                }else {
                    TJ('div.stage_wrap').removeClass('stage_wrap_scale');
                }
            }
            _setH();
            window.onresize = function () {
                _setH();
            }
        })();
        //handleWheel
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
                    }, 20);
                }
                window.onmousewheel = document.onmousewheel = _handleWheel;
                if (window.addEventListener) {
                    window.addEventListener('DOMMouseScroll', _handleWheel, false);
                }
            }
        })(window);

        //preload
        var imgs = [
            's5.png' ,'s4.png' ,'s3.png' ,'s1.png'
            ,'s2_t.png' ,'s2_role2.png' ,'s2_role1.png' ,'s2_flower.png'
            ,'logo.png'
            ,'s5_bg.jpg' ,'s4_bg2.jpg' ,'s4_bg1.jpg' ,'s2_bg2.jpg' ,'s2_bg1.jpg'
            ,'s1_bg2.jpg' ,'s1_bg1.jpg'
        ];
        loadImgCustom(imgs, 'http://ossweb-img.qq.com/images/t7/act/a20141117suspense/', function (n) {
            //todo rename id
            document.getElementById('preloadNum').innerHTML = n ;
            document.getElementById('preloadStatus').style.height = n + '%';
        }, function () {
            document.getElementById('preloadHint').innerHTML = '请滚动鼠标' ;
            TJ('#enterLayer').addClass('enter_layer_anim');
            TJ('body').addClass('client_pc');
        }, 1)

        //core
        var Current = 1;
        var Te = {
            cfg: {
                maxPage:5
                ,timeSep: 1000
                ,animPlay: 0
            }
            ,init: function () {
                this.bindKey();
            }
            ,bindKey: function () {
                var self = this 
                    ;
                function scrollUp () {
                    if (self.cfg.animPlay === 0) {
                        Current -= 1 ;
                        if (Current < 1) {
                            Current = 1;
                        }else {
                            TJ('#stage' + Current ).removeClass('past').addClass('back');
                        }
                        self.syncNav();
                        document.getElementById('preloadWrap').style.visibility = 'visible';
                        
                        self.cfg.animPlay = 1;
                        setTimeout(function () { self.cfg.animPlay = 0; }, self.cfg.timeSep);
                    }
                }
                function scrollDown () {
                    if (self.cfg.animPlay === 0) {
                        Current += 1 ;
                        if (Current > self.cfg.maxPage) {
                            Current = self.cfg.maxPage;
                        }else {
                            TJ('#stage' + (Current - 1)).removeClass('back').addClass('past');
                        }
                        if (Current == self.cfg.maxPage) {
                            document.getElementById('preloadWrap').style.visibility = 'hidden';
                        }
                        self.syncNav();
                        TJ('#preloadWrap').addClass('preload_wrap_past');
                        setTimeout(function () {
                            TJ('#preloadWrap').removeClass('preload_wrap_past');
                        }, 450);

                        self.cfg.animPlay = 1;
                        setTimeout(function () { self.cfg.animPlay = 0; }, self.cfg.timeSep);
                    }
                }
                handleWheel(scrollUp, scrollDown);
                window.onkeyup = function (e) {
                    var kc = (window.event || e).keyCode ;
                    if (kc === 37 || kc === 38 ) {
                        scrollUp();
                    }else if (kc === 39 || kc === 40){
                        scrollDown();
                    }
                }
            }
            ,syncNav: function () {
                var els = TJ('#nav p');
                els.removeClass('on');
                TJ(els[Current-1]).addClass('on');
            }
        };

        TJ(function () {
            Te.init();
        });
    }else {
        TJ('body').addClass('client_pc');
    }
}
