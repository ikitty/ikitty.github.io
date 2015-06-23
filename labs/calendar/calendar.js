/**
 * 日历组件
 *
 * @author: alextang
 * @date: 2010-12-30
 * @update: 2011-07-19 日历精确单位可定制(单位为天或者分钟)，页面上点击任意位置隐藏日历，优化UI
 **/

// 组件样式
var aCSSCalendar = '';
aCSSCalendar += '#elCalendarWrap{z-index:50;display:none;position:fixed;_position:absolute;width:210px;}';
aCSSCalendar += '.winCalendar{position:absolute;padding-bottom:1px;width:210px;border:1px solid #CCC;text-align:center;overflow:hidden;z-index:10; background:#FFF;}';
aCSSCalendar += '.winCalendar .currentTime{position:relative;margin:1px;height:28px;line-height:26px;background-color:#DDD}';
aCSSCalendar += '.winCalendar .arrow{position:absolute;top:0px;padding:2px 3px;font:700 14px/21px  simsun;cursor:pointer}';
aCSSCalendar += '.winCalendar .leftA{left:4px;font-family:verdana}';
aCSSCalendar += '.winCalendar .leftB{left:24px;line-height:24px;margin-left:2px}';
aCSSCalendar += '.winCalendar .rightA{right:4px;font-family:verdana}';
aCSSCalendar += '.winCalendar .rightB{right:24px;line-height:24px;margin-right:2px}';
aCSSCalendar += '.winCalendar .week{zoom:1;overflow:hidden;font:normal 12px/21px Verdana,Tahoma;color:#888}';
aCSSCalendar += '.winCalendar .week li{float:left;width:30px}';
aCSSCalendar += '.winCalendar .days{float:left;clear:both;font:normal 12px/28px Verdana,Tahoma}';
aCSSCalendar += '.winCalendar .days a{float:left;width:28px;height:28px;margin:1px;background-color:#EEE}';
aCSSCalendar += '.winCalendar .days a:link, .winCalendar .days a:visited{text-decoration:none;color:#014ccc}';
aCSSCalendar += '.winCalendar .days a:hover{text-decoration:none;color:#fff;background-color:#333;font-weight:700;}';
aCSSCalendar += '.winCalendar .days a.no_data{cursor:default;}';
aCSSCalendar += '.winCalendar .days a.no_data:hover{background-color:#eee;}';
aCSSCalendar += '.winCalendar .time{position:relative;clear:both;height:27px;padding:5px 0 0 5px;text-align:left;margin:0 1px;background-color:#ccc;font-family:tahoma}';
aCSSCalendar += '.winCalendar .time input{width:40px;height:16px;line-height:16px;padding:2px 0;background-color:#FFF;border:1px solid #999;margin:0 3px;text-align:center;vertical-align:middle}';
aCSSCalendar += '.winCalendar .time .interval{width:5px;height:16px;line-height:13px;padding:2px 0}';
aCSSCalendar += '.winCalendar .time .btnOk{position:absolute;top:5px;right:5px;width:40px;height:20px;line-height:20px;background-color:#FFF;border:1px solid #999;cursor:pointer;text-align:center;}';
aCSSCalendar += '.winCalendar #today{color:#f00}';
aCSSCalendar += '.winCalendar .days .selected{background-color:#999;font-weight:700;color:#fff}';
aCSSCalendar += '.winCalendar .close_win{margin:1px 1px 0;height:18px;overflow:hidden;line-height:18px;background-color:#EEE}';
aCSSCalendar += '.winCalendar .close_win span{float:right;background-color:#eee;color:#f60;padding:0 5px 0 0;cursor:pointer}';
aCSSCalendar += '.frm_calendar {position:absolute;z-index:9;width:210px;height:285px;filter:alpha(opacity=0);opacity:0;}';

document.write('<style type="text/css">'+ aCSSCalendar+ '</style>');

// 组件DOM结构
var aDOMCalendar = '';
aDOMCalendar += '<div id="winCalendar" class="winCalendar">';
aDOMCalendar += '<div class="close_win"><span id="btnCloseCalendar">关闭</span></div>';
aDOMCalendar += '<div id="currentTime" class="currentTime">';
aDOMCalendar += '<strong id="currentYear"></strong> - <strong id="currentMonth"></strong>';
aDOMCalendar += '<span id="yearMinus" class="arrow leftA" title="减少年份">&laquo;</span>';
aDOMCalendar += '<span id="monthMinus" class="arrow leftB" title="减少月份">&lt;</span>';
aDOMCalendar += '<span id="monthPlus" class="arrow rightB" title="增加月份">&gt;</span>';
aDOMCalendar += '<span id="yearPlus" class="arrow rightA" title="增加年份">&raquo;</span>';
aDOMCalendar += '</div>';
aDOMCalendar += '<ul class="week">';
aDOMCalendar += '<li>一</li><li>二</li><li>三</li><li>四</li><li>五</li><li>六</li><li>日</li>';
aDOMCalendar += '</ul>';
aDOMCalendar += '<div id="days" class="days"></div>';
aDOMCalendar += '<div id="time" class="time">';
aDOMCalendar += '<input type="number" id="hours" value="00" maxlength="2" min="0" max="23" autocomplete="off"/><span class="interval">:</span><input type="number" maxlength="2" id="minutes" value="00" min="0" max="59" autocomplete="off"/><span id="secondWrap"><span class="interval">:</span><input type="number" maxlength="2" id="seconds" value="00" min="0" max="59" autocomplete="off"/></span>';
aDOMCalendar += '<span id="btnOk" class="btnOk">确定</span>';
aDOMCalendar += '</div>';
aDOMCalendar += '</div>';
aDOMCalendar += '<iframe class="frm_calendar" id="frmCalendar" src="about:blank" scrolling="no" frameborder="0"></iframe>';

// 在页面中插入日历结构
var insertCalendar = function () {
    if (!document.getElementById('elCalendarWrap')){
        var elCalendarWrap = document.createElement('div') ;
        elCalendarWrap.innerHTML = aDOMCalendar;
        elCalendarWrap.setAttribute('id', 'elCalendarWrap') ;
        document.body.appendChild(elCalendarWrap) ;
    }
} ;


// 日期组件构造函数
var Calendar = function (config) {
    for (var i in arguments[0]) {
        this[i] = arguments[0][i] ;
    }
} ;

// 日期组件原型
Calendar.prototype = {
    finalDate: '',

    getFinalDate: function () {
        return this.finalDate ;
    },

    formatDate: function (y, m, d) {
        var d = this.el.format.replace(/y/i, function (v) { return v == 'Y'? y: (''+y).substring(2) ; }).replace('m', m).replace('d', d);
        return d ;
    },

    display: function (cDate) {
        cDate = cDate || new Date() ;
        var myDate = {
            year: cDate.getFullYear(),
            month: cDate.getMonth() + 1 < 10? '0'+(cDate.getMonth() + 1) :cDate.getMonth() + 1 ,
            date: cDate.getDate(),
            hours: cDate.getHours(),
            minutes: cDate.getMinutes(),
            seconds: cDate.getSeconds()
        } ;
        this.finalDate = this.formatDate(myDate.year ,  myDate.month , (myDate.date < 10? '0' + myDate.date : myDate.date ));

        this.el.year.innerHTML = myDate.year ;
        this.el.month.innerHTML = myDate.month ;

        if (this.el.unit == 'min') {
            this.el.hours.value = myDate.hours;
            this.el.minutes.value = myDate.minutes;
        }else if (this.el.unit == 'sec'){
            this.el.hours.value = myDate.hours;
            this.el.minutes.value = myDate.minutes;
            this.el.seconds.value = myDate.seconds;
        }
        
        // get firstday position in this month
        myDate.firstdayPos = new Date(myDate.year, myDate.month-1, 1).getDay() - 1 ;
        myDate.firstdayPos = myDate.firstdayPos == -1? 6: myDate.firstdayPos ;
        
        // get maxDay in this month
        myDate.maxDayPos = new Date(myDate.year, myDate.month, 0).getDate() + myDate.firstdayPos ;

        var days = this.createDayDom();

        // fill data
        var _self = this ;
        var last = 0 ;
        for (var i = 0, k ; k = days[i] ; i++ ) {
            var t ;
            if (i < myDate.firstdayPos || i >= myDate.maxDayPos){
                t = ' ' ;
                k.className = 'no_data';
            }else {
                t = i + 1 - myDate.firstdayPos ;
                k.onclick = function (t, i) {
                    return function () {
                        days[last].className = '' ;
                        this.className = 'selected' ;
                        last = i ;
                        _self.finalDate = _self.formatDate(myDate.year,  myDate.month, (t < 10? '0' + t : t));

                        if (_self.el.unit == 'day') {
                            if (_self.callback) {
                                _self.callback(_self.finalDate);
                            }
                        }
                    } ;
                }(t, i) ;
            }
            k.innerHTML = t ;
            if (t == myDate.date){
                k.id = this.el.today ;
            }
        }
    },

    // create days DOM
    createDayDom: function () {
        var days = this.el.days.getElementsByTagName('a') ;
        if(days.length <= 0){
            for (var i = 0 ; i < 42  ; i++ ) {
                var el = document.createElement('a') ;
                el.setAttribute('href', 'javascript:void(0);') ;
                this.el.days.appendChild(el) ;
            }
        }else {
            for (var i = 0, k ; k = days[i] ; i++ ) {
                k.className = '' ;
            }
        }

        try {
            document.getElementById(this.el.today).id = '' ;
        }catch (e){}

        return this.el.days.getElementsByTagName('a') ;
    },

    change: function (type) {
        var today = document.getElementById(this.el.today) ;
        var date = {
            year: Number(this.el.year.firstChild.nodeValue),
            month: Number(this.el.month.firstChild.nodeValue) - 1,
            day: Number(today.firstChild.nodeValue) 
        } ;
        switch (type){
            case 'yearPlus':
                date.year++ ;
            break;
            case 'yearMinus':
                date.year-- ;
            break;
            case 'monthPlus':
                date.month++ ;
                if (date.month > 11){
                    date.year++ ;
                    date.month = 0 ;
                }
            break;
            case 'monthMinus':
                date.month-- ;
                if (date.month < 0){
                    date.year-- ;
                    date.month = 11 ;
                }
            break;
        }
        this.display(new Date(date.year, date.month, date.day));
    },

    custom: function () {
        this.display(arguments[0] || new Date());

        var op = this.el.currentTime.getElementsByTagName('span') ;
        var _self = this ;
        for (var i = 0, k ; k = op[i] ; i++ ) {
            k.onclick = function () {
                _self.change(this.id);
            } ;
        }
    }
} ;


var get = function (e) {return document.getElementById(e);} ;

// 获取DOM元素位置
var getXY = function (el, type) {
    type = type || 'x' ;
    if (type == 'x'){
        return el.offsetParent ? el.offsetLeft + getXY(el.offsetParent, 'x') : el.offsetLeft;
    }else if (type == 'y'){
        return el.offsetParent ? el.offsetTop + getXY(el.offsetParent, 'y') : el.offsetTop;
    }
} ;

var isIE6 = (function () {
    return isIE6= /msie 6/gi.test(navigator.userAgent.toLowerCase()) ;
})();

// 阻止冒泡
var stopBubble = function (e) {
    if (e && e.stopPropagation){
        e.stopPropagation();
    }else {
        window.event.cancelBubble = true ;
    }
} ;
    
/**
 * 日期组件对外接口
 *
 * @param (cfg.e) 触发日期控件时传递的事件对象
 * @param (cfg.el) 触发日期控件的DOM 必选
 * @param (cfg.callback) 选择日期的回调函数 必选
 * @param (cfg.format) 日历格式 H:m:s' 可选
 * @param (cfg.pos) 日期控件相对于的触发日期控件DOM的偏移尺寸，默认值[0, 20] 可选
 * @param (cfg.nowDate) 日历初始化时显示的日期 可选
 **/
var userCalendar = function (cfg) {
    var defaultCfg = {
        e: '',
        el: '',
        nowDate: '',
        pos: [0, 3],
        format: 'Y-m-d ',
        callback: ''
    }
    // fix arguments
    for (var i in cfg) {
        if (cfg.hasOwnProperty(i)) {
            defaultCfg[i] = cfg[i];
        }
    }
    // judge format
    defaultCfg.format = defaultCfg.format.replace('h', 'H');
    var unit = 'day' , formatHms ='';
    if (defaultCfg.format.indexOf('H') > -1) {
        var formats = defaultCfg.format.split('H');
        defaultCfg.format = formats[0];
        formatHms = 'H' + formats[1];
        if (formatHms.indexOf('m') > -1) {
            unit = 'min';
        }
        if (formatHms.indexOf('s') > -1) {
            unit = 'sec';
        }
    }

    insertCalendar();
    // 根据已有日期初始化日历
    var elCalendarWrap = get('elCalendarWrap');
    var config = {
        el: {
            year: get('currentYear'),
            month: get('currentMonth'),
            currentTime: get('currentTime'),
            days: get('days'),
            hours: get('hours'),
            minutes: get('minutes'),
            seconds: get('seconds'),
            today: 'today',
            unit: unit,
            format: defaultCfg.format
        },
        callback: function (v) {
            defaultCfg.callback(v);
            elCalendarWrap.style.display = 'none';
        }
    } ;		
    
    var calendar = new Calendar(config) ;

    // init date
    defaultCfg.nowDate = defaultCfg.el.value ;
    var regUserDate = /(\d{4})-(\d{2})-(\d{2})(?:(?:\s)+(\d{2}):(\d{2})(?::(\d{2}))?)?/ ;
    if (regUserDate.test(defaultCfg.nowDate)){
        // var dates = defaultCfg.nowDate.match(/(\d{4})-(\d{2})-(\d{2})/) ;
        var dates= defaultCfg.nowDate.match(regUserDate);
        dates[4] = dates[4] || 0 ;
        dates[5] = dates[5] || 0 ;
        dates[6] = dates[6] || 0 ;
        calendar.custom(new Date(dates[1], dates[2]-1, dates[3], dates[4], dates[5], dates[6]));
    }else {
        calendar.custom();
    }

    // 选择小时和分钟
    if (unit == 'min' || unit == 'sec') {
        get('time').style.display = 'block';
        get('secondWrap').style.display = (unit=='sec')?'inline':'none';

        get('btnOk').onclick = function () {
            var iHour = get('hours').value ,
                iMin = get('minutes').value,
                iSec = get('seconds').value;
            if (iHour < 0 || iHour > 23) {
                alert('小时可以是0至23的数哦!');
                return false ;
            }
            if (iMin <0 ||iMin > 59) {
                alert('分钟可以是0至59的数哦!');
                return false ;
            }
            if (unit == 'sec' && (iSec <0 ||iSec > 59)) {
                alert('秒数可以是0至59的数哦!');
                return false ;
            }
            var iHour = iHour.length < 2? '0'+iHour : iHour,
                iMin = iMin.length <2 ? '0'+iMin : iMin ,
                iSec = iSec.length <2 ? '0'+iSec : iSec ;
            var hms = formatHms.replace('H', iHour).replace('m', iMin).replace('s', iSec);

            var finalDate = calendar.getFinalDate() + hms ;
            if (defaultCfg.callback){
                defaultCfg.callback(finalDate);
            }
            elCalendarWrap.style.display = 'none' ;
        } ;
    }else {
        get('time').style.display = 'none';
    }

    // 定位日历
    elCalendarWrap.style.left = (getXY(defaultCfg.el, 'x') + defaultCfg.pos[0]) + 'px' ;
    elCalendarWrap.style.display = 'block' ;
    var elY = getXY(defaultCfg.el, 'y');
    var calendarY = 0 ;
    if (elY + defaultCfg.pos[1] + get('winCalendar').clientHeight > (document.documentElement.clientHeight + (document.body.scrollTop || document.documentElement.scrollTop))) {
        calendarY = elY - defaultCfg.pos[1] - get('winCalendar').clientHeight;
        if (!isIE6) {
            calendarY -= (document.body.scrollTop || document.documentElement.scrollTop) ;
        }
    }else {
        calendarY = elY + defaultCfg.pos[1] + defaultCfg.el.clientHeight;
        if (!isIE6) {
            calendarY -= (document.body.scrollTop || document.documentElement.scrollTop) ;
        }
    }
    elCalendarWrap.style.top = calendarY + 'px' ;

    // 阻止日历元素上的点击冒泡
    elCalendarWrap.onclick = function (e) {
        e = e || window.event;
        stopBubble(e);
    }
    // 阻止当前点击事件冒泡
    stopBubble(defaultCfg.e);

    // 在页面任意点击会隐藏日历
    document.onclick = function () {
        elCalendarWrap.style.display = 'none' ;
    }

    get('btnCloseCalendar').onclick = function () {
        elCalendarWrap.style.display = 'none' ;
    } ;
} ;

// 调用方法：
// get('txtStartTime').onclick = function (e) {
    // var _self = this;
    // var config = {
        // e: e || window.event,
        // el: this,
        // callback: function (v) { _self.value = v; },
        // format: 'Y-m-d', //optional
        // pos: [0, 3] // optional
    // }
    // userCalendar(config);
// } ;
