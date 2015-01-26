/**
 * Tieji Event Workflow 
 * 
 * Author: alextang
 * Create: 2014-09-14
 * LastModify: 2014-12-09
 */

var act_name = 'a20150129test';

// src dir , build dir
var workdir = '../t7/';

var path_src = workdir + 'act_dev/' + act_name + '/'
    ,path_target = workdir + 'act/' + act_name + '/'
    ,path_template = workdir + 'act_template/'
    ,img_prefix = 'http://ossweb-img.qq.com/images/t7/act/' + act_name + '/'
    ;

// plugin
var gulp = require('gulp')
    ,clean = require('gulp-clean')
    ,concat = require('gulp-concat')
	,g_replace = require('gulp-replace')
	,cssmin = require('gulp-minify-css')
	,uglify = require('gulp-uglify')
    ,encode = require('gulp-convert-encoding')
    ;

var path_dev = {
    js: path_src + 'js/*'
    ,css: path_src + '*.css'
    ,img: path_src + 'images/*'
    ,html: [path_src + '*.htm', path_src + '*.shtml']
};

var path_build = {
    js: path_target + 'js/'
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

// todo init pc or mobile
gulp.task('initMobile',function(){
	gulp.src(path_template + 'mobile/**')
		.pipe(gulp.dest(path_src))
});



// css
gulp.task('css', function() {
    gulp.src(path_dev.css)
        .pipe(concat('style.css'))
        .pipe(g_replace('(images/', '(' + img_prefix ))
        .pipe(cssmin({keepBreaks:true, noAdvanced: true, compatibility:'ie6'}))
        .pipe(gulp.dest(path_build.css))
});

// img
gulp.task('img', function() {
    gulp.src(path_build.img)
        .pipe(clean({force: true}));
        
    gulp.src(path_dev.img)
        .pipe(gulp.dest(path_build.img));
});

// js
gulp.task('js', function() {
    gulp.src(path_dev.js)
        //order by fileName first character
        .pipe(concat('ui.js'))
        .pipe(uglify())
        .pipe(encode({ to: 'gbk'}))
        .pipe(gulp.dest(path_build.js))
});

// html
gulp.task('html',function(){
    gulp.src([path_build.html + '*.htm', path_build.html + '*.shtml'] )
        .pipe(clean({force: true}));

    gulp.src(path_dev.html)
        //如果开发文件是gbk编码，则先要转码后再操作，最后再转成gbk
        //.pipe(encode({ from: 'gbk', to: 'utf-8'}))
        .pipe(g_replace('charset="utf-8"', 'charset="gbk"')) 
        .pipe(g_replace('src="images/', 'src="' + img_prefix ))
        .pipe(g_replace('<script src="js/common.js"></script>', ''))
        .pipe(encode({ to: 'gbk'}))
        .pipe(gulp.dest(path_build.html))

        var D = new Date();
        console.log('Builded html. ==============================  At: ' +   D.getHours() + ':' + D.getMinutes() + ':' + D.getSeconds());
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
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path_template));
});
