'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('index_copy', function () {
  gulp.src('./index.html')
    .pipe(gulp.dest('./.tmp'))
    .pipe(reload({ stream: true }));
});