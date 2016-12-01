var path = require('path');//路径管理
var gulp = require('gulp');
var gutil = require("gulp-util");//未使用
var webpack = require('webpack-stream');
var mypack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var rev = require('gulp-rev');//添加文件版本号
var revReplace = require('gulp-rev-replace');//版本号插件,切换版本
var sourcemaps = require('gulp-sourcemaps');//压缩后的地址展示
var babel = require('gulp-babel');//es6编译
var useref = require('gulp-useref');//
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var sass = require('gulp-sass');//sass
var filter = require('gulp-filter');//过滤器
var uglify = require('gulp-uglify');//丑化和压缩
var csso = require('gulp-csso');//
var autoprefixer = require('gulp-autoprefixer');//自更新页面
var browserify = require('browserify');//打包器
var revCollector = require('gulp-rev-collector');//rev的插件.
var clean = require('gulp-clean');//清扫文件

var rename = require('gulp-rename');//重命名

var process = require('process');

var sync = require('browser-sync');//异步执行
var reload = sync.reload;


//共有路径
var hostDir = path.join('../imama_server/src/main/resources/templates')
var answerPath = path.join(__dirname, '../imama_server/src/main/resources/templates/answer'),
    imamaClassPath = path.join(__dirname, '../imama_server/src/main/resources/templates/imamaclass'),
    activityPath = path.join(__dirname, '../imama_server/src/main/resources/templates/activity');
	
	
var globalConfig={
	hostDir :hostDir,
	sysPath :imamaClassPath,
}
	
	
gulp.task('single',function() {
    return gulp.src(path.resolve(hostDir, './static/cdn-local/mqtt.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.resolve(hostDir, './static')))
});



gulp.task('clean', function() {//清扫错误文件
    gulp.src(globalConfig.sysPath + '/dist/scripts')
    .pipe(clean({force: true}));
});

/*版本开发*/
gulp.task('begin', function() {//webpack整编vue和es6
    console.log('当前路径' + globalConfig.sysPath);
    console.log('我变了');
        // gulp.src('../mytest/js/mm.js')
    return gulp.src(globalConfig.sysPath + '/index.js')
        .pipe(webpack(require('./webpack.config.js')))
        // .pipe(source('bundle.js'))
        .pipe(gulp.dest(globalConfig.sysPath + '/dist'))
});

/*输出script*/
gulp.task('index', ['sass', 'clean', 'begin'], function() {//开发环境发布
    var jsFilter = filter([globalConfig.sysPath + 'dist/main.js'], { restore: true });
    var cssFilter = filter(globalConfig.sysPath + 'css/*.css', { restore: true });
    
    console.log('当前路径' + path.resolve(hostDir, "./imamaClassPath"));
        
 
    return gulp.src(globalConfig.sysPath + '/dist/main.js')
        .pipe(rev())
        .pipe(gulp.dest(globalConfig.sysPath + '/dist/scripts'))   
        .pipe(rev.manifest())
        .pipe(gulp.dest(globalConfig.sysPath))

});

/*样式操作*/
gulp.task('sass', function() {//sass
    return gulp.src(globalConfig.sysPath + '/stylesheets/sass/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions','last 1 version', 'iOS 7'],
            cascade: false
        }))
        .pipe(gulp.dest(globalConfig.sysPath + '/dist/css'))
        // .pipe(reload({ stream: true }))
});


/*构建完整项目*/
gulp.task('home', ['index'], function() {//构建正式项目,会有文件版本更替
    return gulp.src([globalConfig.sysPath + '/rev-manifest.json', globalConfig.sysPath + '/index.html'])
    .pipe(revCollector({
        replaceReved: true
    }))
    .pipe(gulp.dest(globalConfig.sysPath))
})

gulp.task('serve', function() {//开启服务
    sync.init(null, {
        // files: 'maternal/css/style.css',
        proxy: 'localhost:8099',
        files: ['public/**/*.*'],
        notify: false,
        // ws: true
    });
});

gulp.task('dev', ['build'], function() {//开启路由
    sync({
        server: {
            baseDir: path.resolve(hostDir),
            index: "dev.html",
            routes: {
                "/activity": path.resolve(hostDir, "./activity"),
                "/imamaclass": path.resolve(hostDir, "./imamaclass"),
                "/static": path.resolve(hostDir, "./static"),
                "/maternal": path.resolve(hostDir, "./maternal"),
                "/wx-third": path.resolve(hostDir, "./wx-third")
            }
    });
    gulp.watch(globalConfig.sysPath + '/stylesheets/sass/*.scss', ['sass']);
    gulp.watch([globalConfig.sysPath + '/**/*.vue', globalConfig.sysPath + '/**/*.js'], ['begin']);
    gulp.watch(globalConfig.sysPath + '/stylesheets/sass/*.scss').on('change', reload);
});

// path.resolve('/imama_server/src/main/resources/templates', "/imamaclass")
// 火遁*大火球之术：巳－未－申－亥－午－寅 

// 火遁*凤仙火之术：子－寅－戌－丑－卯－寅 

// 火遁*火龙炎弹：未－午－巳－辰－子－丑－寅 

// 水遁*水龙弹：未—午—辰—寅 

// 水遁*水阵壁：寅－巳－寅－巳－寅－巳 

// 水遁*水牢之术：已－未－午－卯－未－午－卯 

// 水遁*大瀑布之术：寅-丑-申-卯-子-亥-酉-丑-午-戌-寅-戌-已-申-卯 

// 土遁*土龙弹：未－午－辰－寅 

// 分身之术：未－巳－寅
