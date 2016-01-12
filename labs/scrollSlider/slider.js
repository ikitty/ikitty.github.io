/**
 * slider
 *
 * @arg.elTrigger, slider trigger
 * @arg.elBody, slider scroll body
 **/

var Slider = function (arg) {
    this.sliderWidth = 500;
    this.count = 5;
    this.triggerId = '';
    this.elBody = null;

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
        this.doClick();
        this.auto && this.autoPlay() ;

        this.elTrigger[this.current].className = 'on';
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
            }, 3000);
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
            k.onclick = function () {
                me.play(this.order);
            }
        }
    }

    ,createTrigger: function () {
        document.getElementById(this.triggerId).innerHTML = (new Array(this.count+1)).join('<i></i>') ;

        var me = this;
        document.getElementById(this.triggerId).onmouseover = function () {
            me.pause();
        };
        document.getElementById(this.triggerId).onmouseout = function () {
            me.autoPlay();
        };
    }
};

var mainSlider = new Slider({
    triggerId: 'sliderTrigger'
    ,elBody: document.getElementById('sliderBody')
    ,sliderWidth: 500
    ,count: 3
});
