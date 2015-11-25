/**
 * T7 common js 
 *
 * @require jQuery
 * @feature tcssReport
 * @feature titleModule
 * @feature mobileDetect
 * @feature showLayer showTips
 **/
;
(function ($, options) {
    var defaults = {
        taId: 0
        ,needShowLayer: 1
        ,needTips:1
        ,needTitle: 1
    };
    var config = $.extend({}, defaults, options);
    if (config.needShowLayer) {
        $.getScript("http://ossweb-img.qq.com/images/js/comm/showDialog.min.js");
    }

    //plugin
    //todo $('*')._alex()
    $.fn._alex = function () {
    };

    //init showTips DOM
    if (config.needTips) {
        var str = '<i class="sod_layer_x" onclick="showDialog.hide();" title="关闭"><i>&#215;</i></i>'
                + '<div class="sod_layer_bd">'
                + '<div class="sod_layer_tit">提示</div>'
                + '<div id="layerTipsCont"></div> '
                + '<div id="layerTipsAction" class="sod_layer_btn_wrap">'
                + '<span onclick="showDialog.hide();" >确认</span>'
                + '</div></div>' ;

        var elTips = document.createElement('div');
        elTips.id = 'layerTips';
        elTips.className = 'sod_layer';
        elTips.innerHTML = str;
        document.body.appendChild(elTips) ;
    }

    $.extend({
        isMobile: (/android|webos|iphone|ipod|blackberry|ieiMobile|opera mini/i.test(navigator.userAgent))

        ,isInClient: !!(navigator.userAgent.indexOf('inTiejiClient') > -1)
            
        ,showLayer: function (opt) {
            var def = {
                id : null,
                bgcolor : "#000",
                opacity : 50,
                onPopupCallback : function(){},
                onCloseCallback : function(){}
            };
            var cfg = $.extend({}, def, opt);

            typeof(showDialog)=='undefined' ? $.getScript("http://ossweb-img.qq.com/images/js/comm/showDialog.min.js", _sDialog) : _sDialog();
            function _sDialog(){
                showDialog.show(cfg);
            }
        }
        ,showTips: function (o) {
            if (typeof o == 'undefined') { return  ; }
            document.getElementById('layerTipsCont').innerHTML = o.msg || '';
            document.getElementById('layerTipsAction').innerHTML = o.action || '<span onclick="showDialog.hide();">确认</span>';
            $.showLayer({'id': 'layerTips'});
        }

    });
    if (config.needTitle && !$.isMobile && !$.isInClient ) {
        $.getScript('http://ossweb-img.qq.com/images/js/title.js', function () {
            if(typeof(ostb_int) == 'function') ostb_int();
        });
    }else {
        document.body.style.paddingTop = '0px';
    }

    if ($.isMobile) {
        document.getElementById('footer_ied').style.display = 'none';
    }

    if ($.isInClient) {
        document.getElementById('footer_ied').style.display = 'none';
        var elHide = document.body.getElementsByClassName('client_hide') ;
        for (var i = 0, k, le = elHide.length ; i < le; i++ ) {
            k = elHide[i];
            k.style.display = 'none';
        }

        var elDis = document.body.getElementsByClassName('client_disabled') ;
        for (var i = 0, k, le = elDis.length ; i < le; i++ ) {
            k = elDis[i];
            k.setAttribute('href', 'javascript:void(0)') ;
        }
    }

    //ping
    function _ping_tcss_ied(){
        $.getScript('http://pingjs.qq.com/ping_tcss_ied.js', function () {
            if(typeof(pgvMain) == 'function') pgvMain();
        });
    }
    function _tajs(){
        $.getScript("http://tajs.qq.com/stats?sId="+ config.taId, _ping_tcss_ied);
    }

    if (config.taId) {
        _tajs();
    }else {
        _ping_tcss_ied();
    }


    window.$$ = $ ;
})(jQuery, {needShowLayer:0, taId:0, needTips:0, needTitle: 1 });

//mobile
(function () {
    window.RAF= window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function (cb) {
        window.setTimeout(cb, 1000/60);
    };
})();
//Canvas Base Class
var alexCanvas = function () { this.init.apply(this, arguments); };  
alexCanvas.prototype = {
    init: function (arg) {
        this.c = null;

        //custom config
        this.cfg = {
            id: 'alexCanvas'
            ,width:200
            ,height:200
            ,lineCap: 'round'
            ,lineJoin: 'round'
            ,lineWidth: 3
            ,fillStyle: 'rgba(250, 0, 0, 0.9)'
            ,strokeStyle: 'rgba(0,0,0, 1.0)'
        };
        for (var i in arg) {
            if (arg.hasOwnProperty(i)) {
                this.cfg[i] = arg[i] ;
            }
        }

        var D = this.cfg ;
        var el = document.getElementById(D.id);
        el.setAttribute('width', D.width) ;
        el.setAttribute('height', D.height) ;

        this.c = el.getContext('2d');
        this.setDrawStyle();
    }
    ,render: function (aPath) {
        var c = this.c ,
            me = this ;

        c.save();
        c.beginPath();  

        for (var i = 0, k = null; k = aPath[i] ; i++ ) {
            c[k.type] && (c[k.type].apply(c, k.v || []));
        }
        c.closePath();
        // c.fill();         
        c.stroke();
        
        // c.restore();
    }

    ,clear: function () {
        this.c.clearRect(0,0, this.cfg.width, this.cfg.height);
    }

    ,setDrawStyle: function (style) {
        style = style || {};
        var c = this.c ,
            config = this.cfg ;

        var styleArr = ['lineCap', 'lineJoin', 'lineWidth', 'fillStyle', 'strokeStyle'];
        for (var i = 0, k, le = styleArr.length ; i < le; i++ ) {
            k = styleArr[i];
            c[k] = style[k] || config[k] ;
        }
    }
};

var mobile = {
    init: function () {
        $$('body').css('background', 'red').height(document.documentElement.clientHeight + 100);
        alert(document.documentElement.clientHeight);
        this.showLine();
        $$('#secondSec').css({top: (document.documentElement.clientHeight)}).show().addClass('modAnim');

        $$('#firstSec').bind('touchstart', function (e) {
            e.preventDefault();
            $$(this).addClass('first_sec_zoomin');
            $$('#secondSec').css({top: 0});

        })

        $$('#mobileAvatar').addClass('mobile_avatar_clip_show');
        $$('#mobileAvatarFoot').css('opacity', 1);
        //$$('#mobileTit').addClass('tit_show');
    }
    ,showLine: function () {
        var myCanvas = new alexCanvas({
            id: 'alexLine'
            ,width: document.documentElement.clientWidth
            ,height: document.documentElement.clientHeight
        });
        myCanvas.rand = function (min, max, digit) {
            var r = Math.random()*(max-min) + min ;
            return digit ? Number(r.toFixed(digit)) : (r | 0) ;
        };
        myCanvas.renderAnim = function () {
            var me =this;

            var lastPoint = [0,0];
            var R = 614
                ,x = 0
                ,y =0
                ,thetaOrigin = 0
                ,theta = thetaOrigin
                ,thetaStep = 0.01
                ,lineArr = new Array(5)
                ,lineColor = ['rgba(250,100,150,0.5)','rgba(50,200,250,0.5)','rgba(50,50,50,0.1)', 'rgba(100,100,100,0.2)', 'rgba(250,250,250,0.1)']
                ;
            var t = 0;
            var _run = function () {
                var aPath = [];
                me.clear();
                for (var i = 0, k, le = lineArr.length ; i < le; i++ ) {
                    k = lineArr[i];

                    x = R - 200- (R)*Math.cos(theta);
                    y = (-100) + (R)*Math.sin(theta);
                    theta += me.rand(thetaStep, thetaStep+0.05, 3); 
                    if (theta > Math.PI*2/4) {
                        theta = thetaOrigin ;
                    }
                    k = [x - (i*me.rand(50,250)), y + (i*me.rand(20,50))];
                    var newPoint = [k[0]+35, k[1]+14];
                    me.setDrawStyle({
                        strokeStyle: lineColor[me.rand(0, 4)]
                        ,lineWidth: me.rand(1,2)
                    });
                    aPath = [];
                    aPath.push({type: 'moveTo', v: k}) ;
                    aPath.push({type: 'lineTo', v: newPoint}) ;
                    me.render(aPath);
                }
                setTimeout(_run, 80);
            };
            _run();
        };
        myCanvas.renderAnim();
    }
};


//start redraw
var DW = document.documentElement.clientWidth ;
var size = {
    w: 260
    ,h : 260
}
var pCanvas = new alexCanvas({
    id: 'mobileTitCanvas'
    ,width: size.w 
    ,height: size.h 
})
$$('#mobileTitCanvas').css({width: size.w*2/3, height: size.h*2/3 });

var canvasRedraw = {
    init: function (redrawObj) {
        this.particleArray = [];
        this.animateArray = [];
        this.particleSize_x = 1;
        this.particleSize_y = 1;
        this.tickTime = 16;
        this.redrawObj = redrawObj;

        this._reset();
        this._initImageData();
        this._execAnimate();
    },

    _reset: function () {
        this.particleArray.length = 0;
        this.animateArray.length = 0;

        this.ite = 200;
        this.start = 0;
        this.end = this.start + this.ite;
    },

    _initImageData: function () {
        img = this.redrawObj ;
        var D = pCanvas.cfg ;
        this.imgx = 0;
        this.imgy = 0;

        pCanvas.clear();
        pCanvas.c.drawImage(img, this.imgx, this.imgy, img.width, img.height);
        var imgData = pCanvas.c.getImageData(this.imgx, this.imgy, img.width, img.height);

        var checkAlpha = 100 ;
        for (var x = 0; x < img.width; x += (this.particleSize_x*1)) {
            for (var y = 0; y < img.height; y += (this.particleSize_y*1)) {
                var i = (y * imgData.width + x) * 4;

                checkAlpha = y>=150 ? 50 : 130;
                //checkAlpha = 0;
                if (imgData.data[i + 3] >= checkAlpha) {
                    var alpha = Number((imgData.data[i+3]/255).toFixed(2) );
                    var color = "rgba(" + imgData.data[i] + "," + imgData.data[i + 1] + "," + imgData.data[i + 2] + "," + alpha + ")";

                    var x_random = x + Math.random() * 20,
                            vx = -Math.random() * 200 + 200,

                            y_random = img.height/2 - Math.random() * 40 + 20,
                            vy;

                    if (y_random < this.imgy + img.height / 2) {
                        vy = Math.random() * 200;
                    } else {
                        vy = -Math.random() * 200;
                    }

                    this.particleArray.push(
                        new Particle(
                            x_random + this.imgx,
                            y_random + this.imgy,
                            x + this.imgx,
                            y + this.imgy,
                            vx,
                            vy,
                            color
                        )
                    );
                }
            }
        }

    },

    _execAnimate: function () {
        var that = this;

        this.particleArray.sort(function (a, b) {
            return a.ex - b.ex;
        });

        if (!this.isInit) {
            this.isInit = true;
            animate(function (tickTime) {
                if (that.animateArray.length < that.particleArray.length) {
                    if (that.end > (that.particleArray.length - 1)) {
                        that.end = (that.particleArray.length - 1)
                    }
                    that.animateArray = that.animateArray.concat(that.particleArray.slice(that.start, that.end))

                    that.start += that.ite;
                    that.end += that.ite;
                }

                that.animateArray.forEach(function (ele) {
                    ele.update(tickTime);
                })
            })
        }
    }
}

function animate(tick) {
    if (typeof tick == "function") {
        pCanvas.clear();

        tick(canvasRedraw.tickTime);

        RAF(function () {
            animate(tick)
        })
    }
}

// Particle Class
function Particle(x, y, ex, ey, vx, vy, color) {
    this.x = x;
    this.y = y;
    this.ex = ex;
    this.ey = ey;
    this.vx = vx;
    this.vy = vy;

    //circle radius
    this.a = 1000;
    this.color = color;
    this.width = 1;
    this.height = 1;

    this.stop = false;
    this.static = false;
    // this.maxCheckTimes = 10;
    this.maxCheckTimes = 1;
    this.checkLength = 10;
    this.checkTimes = 0;
}

Particle.prototype = {
    constructor: Particle,
    drawSelf: function () {
        pCanvas.c.fillStyle = this.color;
        pCanvas.c.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    },

    move:function(tickTime){
        if (this.stop) {
            this.x = this.ex;
            this.y = this.ey;
        } else {
            tickTime = tickTime / 1000;

            var cx = this.ex - this.x;
            var cy = this.ey - this.y;
            var angle = Math.atan(cy / cx);
            var ax = Math.abs(this.a * Math.cos(angle));
            ax = this.x > this.ex ? -ax : ax

            var ay = Math.abs(this.a * Math.sin(angle));
            ay = this.y > this.ey ? -ay : ay;

            this.vx += ax * tickTime;
            this.vy += ay * tickTime;
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.x += this.vx * tickTime;
            this.y += this.vy * tickTime;

            if (Math.abs(this.x - this.ex) <= this.checkLength && Math.abs(this.y - this.ey) <= this.checkLength) {
                this.checkTimes++;
                // if (this.checkTimes >= this.maxCheckTimes) {
                    this.stop = true;
                // }
            } else {
                this.checkTimes = 0
            }
        }
    },

    update: function (tickTime) {
        this.move(tickTime);
        this.drawSelf();
    }
};

//DOMReady
$$(function () {
    if ($$.isMobile) {
        mobile.init();

        var img = document.getElementById("mobileTitImg");
        if (img.complete) {
            canvasRedraw.init(img);
        } else {
            img.onload = function () {
                canvasRedraw.init(img);
            }
        }
    }
});
