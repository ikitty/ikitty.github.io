/**
 * Tieji Event Workflow 
 * 
 * Author: enix
 * Create: 2014-09-14
 * LastModify: 2016-10-17
 * updates: js,css资源分平台分别打包； build后的js放到根目录 ; 移动端html引用的js文件名调整为ui_mobile.js
 */

//var act_name = 'a20160908zhongqiu';
var act_name = 'a20161017invite';



// get cli args, gulp cmd -t7
var defaultGame = 'hbp';
var argv = process.argv.slice(3);
var gameName = argv.length ? argv[0].split('-')[1]  : defaultGame ;

var workdir = '../' + gameName + '/';

var path_src = workdir + 'act_dev/' + act_name + '/'
    ,path_target = workdir + 'act/' + act_name + '/'
    ,path_template = workdir + 'act_template/'
    ,img_prefix = 'http://game.gtimg.cn/images/' + gameName + '/act/' + act_name + '/'
    ;

// plugin
var gulp = require('gulp')
    ,clean = require('gulp-clean')
    ,concat = require('gulp-concat')
	,g_replace = require('gulp-replace')
	,cssmin = require('gulp-minify-css')
	,cssAutoPrefix = require('gulp-autoprefixer')
	,uglify = require('gulp-uglify')
    ,encode = require('gulp-convert-encoding')
    ,rename = require('gulp-rename')
    ,dom_replace = require('gulp-html-replace')
    ,px2rem = require('gulp-px2rem')
    ;

var path_dev = {
    js: path_src + 'js/'
    ,css: path_src 
    ,img: path_src + 'images/*'
    ,html: [path_src + '*.htm', path_src + '*.html',  path_src + '*.shtml']
};

var path_build = {
    js: path_target 
    ,css: path_target 
    ,img: path_target + 'images/'
    ,html: path_target
};


// init project
gulp.task('init',function(){
    // ** means copy folder and files in folder
	gulp.src(path_template + 'pc/**')
		.pipe(gulp.dest(path_src))
});

//just test
gulp.task('test',function(){ console.log(workdir, img_prefix) ; });


//------------start
// img
gulp.task('img', function() {
    //read false  option prevent from operation unexist file 
    gulp.src(path_build.img + '*', {read:false})
        .pipe(clean({force: true}));
        
    gulp.src(path_dev.img)
        .pipe(gulp.dest(path_build.img));
    var D = new Date();
    console.log('Builded ======' + act_name + '====== Img At: ' +   D.getHours() + ':' + D.getMinutes() + ':' + D.getSeconds());
});
// css
gulp.task('css', function() {
    //for PC
    gulp.src(path_dev.css + 'style.css')
        .pipe(concat('style.css'))
        .pipe(g_replace('\r', '')) 
        .pipe(g_replace('(images/', '(' + img_prefix ))
        //.pipe(cssmin({keepBreaks:true, noAdvanced: true, compatibility:'ie6'}))
        .pipe(cssAutoPrefix())
        .pipe(gulp.dest(path_build.css))

    //for Mobile
    gulp.src(path_dev.css + 'style_m.css')
        .pipe(concat('style_m.css'))
        .pipe(g_replace('\r', '')) 
        .pipe(g_replace('(images/', '(' + img_prefix ))
        .pipe(px2rem({ replace: true , rootValue: 20,  unitPrecision:3, minPx: 5, propertyBlackList: [ 'font', 'font-size']}))
        .pipe(cssAutoPrefix())
        .pipe(gulp.dest(path_build.css))
    var D = new Date();
    console.log('Builded ======' + act_name + '====== Css At: ' +   D.getHours() + ':' + D.getMinutes() + ':' + D.getSeconds());
});


// js
// pc和移动端分开打包，pc打包没有mobile前缀的js文件，移动端的反之
gulp.task('js', function() {
    //for PC
    gulp.src([path_dev.js + '*.js', '!' + path_dev.js + 'mobile_*.js'])
        //order by fileName first character
        .pipe(concat('ui.js'))
        //.pipe(uglify({compress:{conditionals: false}}))
        .pipe(g_replace('\r', '')) 
        .pipe(encode({ to: 'gbk'}))
        .pipe(gulp.dest(path_build.js))

    //for mobile
    gulp.src([path_dev.js + 'mobile_*.js'])
        .pipe(concat('ui_mobile.js'))
        .pipe(g_replace('\r', '')) 
        .pipe(encode({ to: 'gbk'}))
        .pipe(gulp.dest(path_build.js))

    //copy data js
    gulp.src(path_src + 'ui_*.js')
        //.pipe(encode({ to: 'gbk'}))
        .pipe(gulp.dest(path_target));

    var D = new Date();
    console.log('Builded ======' + act_name + '====== Js At: ' +   D.getHours() + ':' + D.getMinutes() + ':' + D.getSeconds());
});

// html
gulp.task('html',function(){
    gulp.src([path_build.html + '*.htm', path_build.html + '*.html',  path_build.html + '*.shtml'] , {read:false})
        .pipe(clean({force: true}));


    gulp.src(path_dev.html)
        //如果开发文件是gbk编码，则先要转码后再操作，最后再转成gbk
        //.pipe(encode({ from: 'gbk', to: 'utf-8'}))
        .pipe(g_replace('charset="utf-8"', 'charset="gbk"')) 
        .pipe(g_replace('src="images/', 'src="' + img_prefix ))
        .pipe(dom_replace({
            'common': '<!--#include virtual="common.htm"-->'
            ,'commonJs': '<script src="ui.js"></script>'
            ,'commonJsMobile': '<script src="ui_mobile.js"></script>'
        })) 
        .pipe(encode({ to: 'gbk'}))
        .pipe(gulp.dest(path_build.html))
        //.pipe(rename(function (path) {
            //if (path.basename != 'common') {
                //path.extname = '.shtml';
            //}
        //}))
        //.pipe(gulp.dest(path_build.html + 'shtml/'))

        var D = new Date();
    console.log('Builded ======' + act_name + '====== Html At: ' +   D.getHours() + ':' + D.getMinutes() + ':' + D.getSeconds());
});


gulp.task('build', ['css', 'js', 'img', 'html']);

gulp.task('watch', ['css', 'js', 'img', 'html'], function() {
    gulp.watch(path_dev.js, ['js']);
    gulp.watch(path_dev.css, ['css']);
    gulp.watch(path_dev.img, ['img']);
    gulp.watch(path_dev.html, ['html']);
});

// ====================================
// common test
// ====================================
var rename = require('gulp-rename');
gulp.task('jsmin',  function() {
    return gulp.src(path_template + '*.js')
        .pipe(uglify({compress:{conditionals: false}}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path_template));
});
