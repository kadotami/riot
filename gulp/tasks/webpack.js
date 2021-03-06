var gulp = require('gulp');
var riot = require('gulp-riot');
var webpack = require('gulp-webpack');
var config = require('../config');
var browserSync = require('browser-sync');
var uglify = require('gulp-uglify');
var reload = browserSync.reload;

gulp.task('webpack',['riot'], function () {
  gulp.src(config.webpack.entry)
    .pipe(webpack(config.webpack))
    .pipe(uglify())
    .pipe(gulp.dest('./.tmp'))
    .pipe(reload({ stream: true }));
});