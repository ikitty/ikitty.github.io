//auto height
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
            }, 50);
        }
        window.onmousewheel = document.onmousewheel = _handleWheel;
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', _handleWheel, false);
        }
    }
})(window);


var Current = 1;
var Te = {
    cfg: {
        maxPage:3
    }
    ,init: function () {
        this.bindKey();
    }
    ,bindKey: function () {
        var self = this 
            ;
        function scrollUp () {
            Current -= 1 ;
            if (Current < 1) {
                Current = 1;
            }
            TJ('#stage' + Current ).removeClass('past').addClass('back');
            self.syncNav();
        }
        function scrollDown () {
            TJ('#stage' + Current).removeClass('back').addClass('past');
            Current += 1 ;
            if (Current > self.cfg.maxPage) {
                Current = self.cfg.maxPage;
            }
            self.syncNav();
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
    TJ('#enterLayer').addClass('enter_layer_anim');
});

//todo preload
//js wheel
