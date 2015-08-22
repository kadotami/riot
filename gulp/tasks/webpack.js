var gulp = require('gulp');
var riot = require('gulp-riot');
var uglify = require('gulp-uglify');
var webpack = require('gulp-webpack');
var config = require('../config');

gulp.task('webpack', function () {
  gulp.src("./src/tags/*.tag")
    .pipe(riot())
    .pipe(gulp.dest(config.riot.output));
  gulp.src(config.webpack.entry)
    .pipe(webpack(config.webpack))
    .pipe(gulp.dest('./.tmp'));
});