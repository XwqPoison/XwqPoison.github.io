//gulpfile.js主配置文件，用于定义任务
// 此处代码是由Node执行


"use strict";//必须位于首行
//加载模块
var gulp=require("gulp");
var $=require("gulp-load-plugins")();//根据依赖关系自动加载插件
var browserSync = require('browser-sync').create();

//创建一个全局变量，用来定义目录路径
var app={
	srcPath:"src/",//源码source
	devPath:"build/",//构建,便于测试
	prdPath:"dist/"//发布distribution
};



//定义复制文件的功能
gulp.task("html",function(){
	gulp.src(app.srcPath+"**/*.html")//读取文件
	.pipe($.concat("index.html"))
	.pipe(gulp.dest(app.devPath))
	.pipe($.htmlmin({
		collapseWhitespace:true,//去掉空格
		removeComments:true,//去掉注释
		removeEmptyAttributes:true,//去掉空的属性
		removeAttributeQuotes:true//去掉属性的引号
	}))
	.pipe(gulp.dest(app.prdPath))//通过管道再次操作，写入到文件夹dist中去
	.pipe(browserSync.stream());

});

gulp.task("css",function(){
	gulp.src(app.srcPath+"**/*.css")
	
	.pipe($.cssmin())
	.pipe(gulp.dest(app.prdPath+"css"))
	.pipe(browserSync.stream());//浏览器的同步（与自己编写的代码实现同步）
});



//定义清空内容的任务
gulp.task("clean",function(){
	gulp.src(app.prdPath)
	.pipe($.clean())
	.pipe(browserSync.stream());//清空
	
});

//合并任务
// 如果任务名是default，那么执行任务的时候可以直接gulp
gulp.task("dist",["html","css"]);

//定义一个监视任务，监视文件的变化
gulp.task("watch",function(){
	//监视src目录下所有的html文件，当发生改变的时候，会自动执行html任务
	gulp.watch(app.srcPath+"**/*.html",["html"]);
	
	gulp.watch(app.srcPath+"css/*",["css"]);
});

//启动browser-sync静态服务器，实现浏览器的同步
gulp.task("default",["html","css","watch"],function(){
	browserSync.init({
		server:{
			baseDir:app.prdPath//如果是dist文件下有一个index.html文件，默认自动打开
		},
		port:2018
	});
});



