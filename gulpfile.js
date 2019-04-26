var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');  //例外處理，避免例外導致 gulp watch 失效中斷
var postcss = require('gulp-postcss');   //CSS 前綴詞
var rename = require("gulp-rename");
var cleanCSS = require('gulp-clean-css');   //css壓縮
var gulpSequence = require('gulp-sequence');  //任務有順序的跑
var concat = require('gulp-concat'); // 合併css
var autoprefixer = require('autoprefixer');  //CSS 前綴詞
var babel = require('gulp-babel');    //編譯ES5 到 ES6 ES7
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps'); 

gulp.task('copyHtml',function(){
  return gulp.src('./src/*.html')
  .pipe(rename('index'))
  .pipe(gulp.dest('./public'));
});

gulp.task('sass',function(){
  var plugins =[
    autoprefixer({
      browsers:['last 3 version',
                '> 5%','ie 6-8',
                'Android >= 4.0',
                'Firefox ESR',
               
               
                'last 3 Safari versions']
              
              })
  ];
  return gulp.src('./src/scss/sweet.scss')
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass().on('error',sass.logError))
  //編譯完成
  .pipe(postcss(plugins)) //強化CSS 支援bower
  .pipe(sourcemaps.write('.'))
  .pipe(rename('all.css'))
  .pipe(gulp.dest('./src/CSS'));
});

gulp.task('minifycss', function () {
  return gulp.src('./src/CSS/all.css')
    .pipe(cleanCSS())  
    .pipe(gulp.dest('./public/css'));
});

gulp.task('uglify',function(){
   gulp.src('./src/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['env']
  })) 
  .pipe(concat('my.min.js'))
  .pipe(uglify())
  .pipe(sourcemaps.write(''))
  //.pipe(concat('main.js'))
  .pipe(gulp.dest('./public/js'))
});

gulp.task('watch',function(){
  gulp.watch('./src/scss/**/*.scss',['sass']);
  gulp.watch('./src/CSS/**/*.css',['minifycss']); 
  
});

//gulp.task('default',['sass','minifycss','watch']);
gulp.task('default', gulpSequence('sass', 'minifycss','uglify'));
