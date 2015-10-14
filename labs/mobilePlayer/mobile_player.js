/**
 * mobile player for mobile device
 *
 * @param {Object} {'songlist': [songInfo]}
 *
 **/
var MobilePlayer = function () {
    this.init.apply(this, arguments);
};  
MobilePlayer.prototype = {
    init: function (arg) {
        //self config
        this.isBegin = false;
        this.isPlaying = false ;

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
            $('#mpList').append('<li>' + k.n + '<span>'+ k.a + '</span></li>');
        });
        $('#mpList li').tap(function () {
            $.qPlayer.playAnyPos($(this).index());
            self.resetSongUI();

            $('#plistWrap').fadeOut();
        });
        $('#showList').tap(function () {
            $('#plistWrap').fadeIn(300);
        });
        $('#plistClose').tap(function () {
            $('#plistWrap').fadeOut(200);
        });
    }
    ,initUI: function () {
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
        function parseTime(t){
            t = Math.floor(t);
            var m = Math.floor(t/60);
            var s = (t%60)<10?'0'+t%60:t%60;
            return m+":"+s;
        }

        $.qPlayer.on("timeupdate", function (timeinfo) {
            $('#songTimeCur').html(parseTime(timeinfo.currentTime));
            $('#songTimeTotal').html(parseTime(timeinfo.totalTime));
            $('#songPlayed').css('width',timeinfo.currentTime * 100 / timeinfo.totalTime + "%");
        });
        $.qPlayer.on("downloadprogress", function (s) {
            $('#songDown').width(s.nProgress + "%");
        });
    }
    ,play: function () {
        $.qPlayer.play();
        this.isPlaying = 1 ;
        this.resetSongUI();
    }
    ,pause: function () {
        $.qPlayer.pause();
        this.isPlaying = 0 ;
        this.playPause.removeClass('song_pause').addClass('song_play');
        $('#cdEdge').addClass('aniPause');
    }
    ,prev: function () {
        $.qPlayer.prev(); 
        this.isPlaying = 1 ;
        this.resetSongUI();
    }
    ,next: function () {
        $.qPlayer.next(); 
        this.isPlaying = 1 ;
        this.resetSongUI();
    }
    ,resetSongUI: function () {
        var song = $.qPlayer.playList.getSongInfoObj();

        $('#mTitle').html(song.n+'<span>'+song.a+'</span>');
        $('#mBg , #cdImg').attr('style','background-image:url(http://game.gtimg.cn/images/mho/act/a20150716music/cover/bg'+song.id+'.jpg)');

        $('#cdEdge').addClass('aniRotate').removeClass('aniPause');
        this.playPause.removeClass('song_play').addClass('song_pause');
        $('#songDown, #songPlayed').width("0%");
        $('#songTimeCur, #songTimeTotal').html('00:00');

        $('#mpList li').removeClass().eq( $.qPlayer.playList.getPostion() ).addClass('nowPlaying');
    }
}

/* =====end===== */
