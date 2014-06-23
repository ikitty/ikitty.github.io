/**
 * iMobile , 帮你的移动端页面兼容多种分辨率的小助手
 *
 **/
var iMobile = {
    ua: navigator.userAgent.toLowerCase()

    ,isMobile: function () {
        return (/android|webos|iphone|ipod|blackberry|ieiMobile|opera mini/i.test(this.ua)) ;
    }

    ,init: function (orgWidth) {
        var me = this;
        me.orgWidth = orgWidth || 640 ;
        me.applyDevice();

        var stResize;
        window.onresize = function () {
            stResize && clearTimeout(stResize);
            stResize = setTimeout(function () {
                me.applyDevice();
            }, 80);
        }
    }
    ,applyDevice: function () {
        var gWidth=document.documentElement.clientWidth,
            gHeight = document.documentElement.clientHeight ,
            ratio = (gWidth/this.orgWidth).toFixed(3);
            
        document.body.style.height = gHeight + 'px';
        if (/applewebkit/i.test(this.ua)) {
            document.body.style.zoom = ratio ;
        }else {
            document.body.style.webkitTransform = 'scale(' + ratio + ')';
        }
    }
};

if (iMobile.isMobile()) {
    //可选参数：页面原始宽度，默认为640
    iMobile.init();
}
