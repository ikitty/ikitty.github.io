//auto height
var ua = navigator.userAgent.toLowerCase();
var isMobile = (/android|webos|iphone|ipod|blackberry|ieiMobile|opera mini/i.test(this.ua)) ;

// require TJ
// require common loadImg
if (isMobile) {
    //set size
    //loadImg
    //TE.init
    //require wxshare
}else {
    if (isMordenBrowser) {
        //set size
        //preload
        //require wheel
        //TE.init
    }else {
        
    }

    var imgPrefix = 'http://ossweb-img.qq.com/images/t7/act/a20141117suspense/'
        ,preloadStatus = document.getElementById('preloadCover')
        ,preloadHint = document.getElementById('preloadHint')
        ,preloadNum = document.getElementById('preloadNum')
        ;
    //todo remove test
    imgPrefix = 'images/';

    var imgs = [
        's5.png'
        ,'s4.png'
        ,'s3.png'
        ,'s1.png'
        ,'s2_t.png'
        ,'s2_role2.png'
        ,'s2_role1.png'
        ,'s2_flower.png'
        ,'logo.png'
        ,'s5_bg.jpg'
        ,'s4_bg2.jpg'
        ,'s4_bg1.jpg'
        ,'s2_bg2.jpg'
        ,'s2_bg1.jpg'
        ,'s1_bg2.jpg'
        ,'s1_bg1.jpg'
    ];
    for (var i = 0, k = null; k = imgs[i] ; i++ ) {
        imgs[i] = imgPrefix + k;
    }
    var imgLoadPc = new imgLoad({
        resource: imgs
        ,loading: function (n) {
            preloadNum.innerHTML = n ;
            preloadStatus.style.height = n + '%';
        }
        ,done: function () {
            setTimeout(function () { preloadNum.style.visibility = 'hidden'; }, 100);
            preloadHint.innerHTML = 'Çë¹ö¶¯Êó±ê' ;
            TJ('body').removeClass('client_mobile');
            TJ('#enterLayer').addClass('enter_layer_anim');
        }
    })
}

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
