'use strict';

var gulp = require('gulp');

gulp.task('index_copy', function () {
  gulp.src('./index.html').pipe(gulp.dest('./.tmp'));
});