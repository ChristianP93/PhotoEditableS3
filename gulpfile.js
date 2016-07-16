var gulp = require('gulp')
var concat = require('gulp-concat')
var rename = require('gulp-rename')
var util = require('gulp-util');
var ngConfig = require('gulp-ng-config');
var watch = require('gulp-watch');
var eslint = require('gulp-eslint');
var clean = require('gulp-clean');
var sourcemaps = require('gulp-sourcemaps');

var config = require('./gulpconfig.json');

gulp.task('build-html', function () {
  gulp.src(config.htmlSrc)
  .pipe(gulp.dest(config.DEST+'/../view'))
})

gulp.task('build-js', function () {
  gulp.src(config.jsSrc)
  .pipe(sourcemaps.init())
  .pipe(concat('bundle.js'))
  .pipe(sourcemaps.write(config.DEST))
  .pipe(gulp.dest(config.DEST))
})

gulp.task('build-css', function () {
  gulp.src(config.cssSrc)
  .pipe(concat('style.css'))
  .pipe(gulp.dest(config.DEST));
})

gulp.task('build-json', function(){
  gulp.src(config.jsonSrc)
  .pipe(gulp.dest(config.DEST))
})

gulp.task('build-config', function () {
  var target = util.env.target || 'miao';
  gulp.src(['config/'+target+'.json'])
  .pipe(ngConfig('App', { createModule: false }))
  .pipe(rename('config.js'))
  .pipe(gulp.dest(config.DEST))
})

gulp.task('build', ['build-config', 'build-js', 'build-html', 'build-css', 'build-json'],  function(){});

gulp.task('watch', function() {
  gulp.watch(config.jsSrc, ['build-js']);
  gulp.watch(config.htmlSrc, ['build-html']);
  gulp.watch(config.cssSrc, ['build-css']);
  gulp.watch(config.jsonSrc, ['build-json']);
});

gulp.task('clean', function () {
    return gulp.src(config.buildLibs, {read: false})
        .pipe(clean());
});

gulp.task('lint', function () {
    return gulp.src(config.jsSrc)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
