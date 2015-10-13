var player;

var loading ={
    dom0:'<div class="sk-fading-circle"><div class="sk-circle1 sk-circle"></div><div class="sk-circle2 sk-circle"></div><div class="sk-circle3 sk-circle"></div><div class="sk-circle4 sk-circle"></div><div class="sk-circle5 sk-circle"></div><div class="sk-circle6 sk-circle"></div><div class="sk-circle7 sk-circle"></div><div class="sk-circle8 sk-circle"></div><div class="sk-circle9 sk-circle"></div><div class="sk-circle10 sk-circle"></div><div class="sk-circle11 sk-circle"></div><div class="sk-circle12 sk-circle"></div></div>',
    dom:'Loading',
    end:'<div id="mCoverImg"></div>'
}

function parseTime(t){
    t = Math.floor(t);
    var m = Math.floor(t/60);
    var s = (t%60)<10?'0'+t%60:t%60;
    return m+":"+s;
}

/* =====start===== */
var MobilePlayer = function () {
    this.init.apply(this, arguments);
};  
MobilePlayer.prototype = {
    init: function (arg) {
        //self config
        this.isBegin = false;
        this.isPlaying = false ;
        this.curMusicPos = 0 ;

        this.playPause = $('#mPlayPause');

        //custom config
        this.cfg = {};
        for (var i in arg) {
            if (arg.hasOwnProperty(i)) {
                this.cfg[i] = arg[i];
            }
        }

        this.initPlayList();
        this.initUI();
        this.initQPlayer();
        this.play();
    }
    ,initPlayList: function () {
        var songlist = this.cfg.songlist ;
        var self = this;

        $.qPlayer.init({
            fromTag : 44, //统计QQ音乐库内流媒体请求来源，外部门使用统一为44
            statFromtag : 12 //web前端上报来源，细分外部门调用传参数
        });
        $.qPlayer.play({
            list: songlist
            ,isPlay: false
        });


        //init DOM
        $(songlist).each(function (i, k) {
            $('#mpList').append('<li>' + k.n + ' &nbsp; '+ k.a + '</li>');
        });
        $('#mpList li').tap(function () {
            $.qPlayer.playAnyPos($(this).index());
            self.showSongInfo();

            $('#plistWrap').fadeOut();
        });
        $('#btnList').tap(function () {
            $('#plistWrap').fadeIn();
        });
        $('#plistClose').tap(function () {
            $('#plistWrap').fadeOut();
        });

        $('#mpList li').attr('class','');
        $('#mpList li').eq($.qPlayer.playList.getPostion()).addClass('nowPlaying');

    }
    ,initUI: function () {
        // $('#mTitle').html(song.n+'<span>'+song.a+'</span>');
        
        var self = this;
        this.playPause.tap(function () {
            if (self.isPlaying) {
                self.pause();
            }else {
                self.play();
            }
        });
        $('#mPrev').tap(function () {
            self.prev();
        });
        $('#mNext').tap(function () {
            self.next();
        });
    }
    ,initQPlayer: function () {
        $.qPlayer.on("timeupdate", function (timeinfo) {
            $('#mCur').html(parseTime(timeinfo.currentTime));
            $('#mTol').html(parseTime(timeinfo.totalTime));
            $('#mPlayed').css('width',timeinfo.currentTime * 100 / timeinfo.totalTime + "%");
        });
        $.qPlayer.on("downloadprogress", function (s) {
            $('#mDownload').width(s.nProgress + "%");
        });

        //todo在 qp状态变更的同时切换所有状态
    }
    ,play: function () {
        $.qPlayer.play();
        this.isPlaying = 1 ;
        this.playPause.removeClass('mPlay').addClass('mPause');
        this.showSongInfo();
    }
    ,pause: function () {
        $.qPlayer.pause();
        this.isPlaying = 0 ;
        this.playPause.removeClass('mPause').addClass('mPlay');
        $('.mCoverBack').addClass('aniPause');
    }
    ,prev: function () {
        $.qPlayer.prev(); 
        this.isPlaying = 1 ;
        this.playPause.removeClass('mPlay').addClass('mPause');
        this.showSongInfo();
        $('#mDownload').width("0%");
        $('#mPlayed').width('0%');
        $('#mCur').html(0);
        $('#mTol').html(0);
    }
    ,next: function () {
        $.qPlayer.next(); 
        this.isPlaying = 1 ;
        this.playPause.removeClass('mPlay').addClass('mPause');
        this.showSongInfo();
        $('#mDownload').width("0%");
        $('#mPlayed').width('0%');
        $('#mCur').html(0);
        $('#mTol').html(0);
    }
    ,showSongInfo: function () {
        var song = $.qPlayer.playList.getSongInfoObj();

        $('#mTitle').html(song.n+'<span>'+song.a+'</span>');
        $('#mbg , #mCoverImg').attr('style','background-image:url(http://game.gtimg.cn/images/mho/act/a20150716music/cover/bg'+song.id+'.jpg');
        $('.mCoverBack').addClass('aniRotate').removeClass('aniPause');
    }
}

/* =====end===== */
