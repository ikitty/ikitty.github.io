/**
 * Tieji Event Workflow 
 * 
 * Author: alextang
 * Create: 2014-09-14
 * LastModify: 2014-12-09
 */

var act_name = 'adate';

// src dir , build dir
var path_src = 'act_dev/' + act_name + '/'
    ,path_target = 'act/' + act_name + '/'
    ,path_template = 'act_template/'
    ,img_prefix = 'http://ossweb-img.qq.com/images/t7/act/' + act_name + '/'
    ;

// plugin
var gulp = require('gulp')
	,del = require('del')
    ,concat = require('gulp-concat')
	,replace = require('gulp-replace')
	,cssmin = require('gulp-minify-css')
	,uglify = require('gulp-uglify')
    ,encode = require('gulp-convert-encoding')
    ;

var path_dev = {
    js: path_src + 'js/*'
    ,css: path_src + 'css/*'
    ,img: path_src + 'images/*'
    ,html: [path_src + '*.htm', path_src + '*.shtml']
};

var path_build = {
    js: path_target + 'js/'
    ,css: path_target + 'css/'
    ,img: path_target + 'images/'
    ,html: path_target
};


// init project
gulp.task('init',function(){
	gulp.src(path_template + 'pc/*')
		.pipe(gulp.dest(path_src))
});

// todo init pc or mobile
gulp.task('initMobile',function(){
	gulp.src(path_template + 'mobile/*')
		.pipe(gulp.dest(path_src))
});



// css
gulp.task('css', function() {
    gulp.src(path_dev.css)
        .pipe(concat('style.css'))
        .pipe(replace('(images/', '(' + img_prefix ))
        .pipe(cssmin({keepBreaks:true}))
        .pipe(gulp.dest(path_build.css))
});

// img
gulp.task('img', function() {
    del(path_build.img + '*', function () {
        gulp.src(path_dev.img)
            .pipe(gulp.dest(path_build.img))
    });
});

// js
gulp.task('js', function() {
    gulp.src(path_dev.js)
        //order by fileName first character
        .pipe(concat('ui.js'))
        .pipe(uglify())
        //根据情况决定是否要转码
        .pipe(gulp.dest(path_build.js))
});

// html
gulp.task('html',function(){
	del([path_build.html + '*.htm', path_build.html + '/*.shtml'], function(){
  		gulp.src(path_dev.html)
            //如果开发文件是gbk编码，则先要转码后再操作，最后再转成gbk
            //.pipe(encode({ from: 'gbk', to: 'utf-8'}))
            .pipe(replace('charset="utf-8"', 'charset="gbk"')) 
            .pipe(replace('src="images/', 'src="' + img_prefix ))
            .pipe(encode({ to: 'gbk'}))
            .pipe(gulp.dest(path_build.html))

            console.log('Build build HTML file. OK!')
  	});
});


gulp.task('build', ['css', 'js', 'img', 'html'])

//common test
var rename = require('gulp-rename');
gulp.task('jsmin',  function() {
    return gulp.src(path_template + '*.js')
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path_template));
});
