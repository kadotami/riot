'use strict';

var gulp = require('gulp');

gulp.task('inject', function () {
  gulp.src('./index.html').pipe(gulp.dest('./.tmp'));
});