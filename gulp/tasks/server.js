'use strict';

var path = require('path');
var gulp = require('gulp');

var browserSync = require('browser-sync');

gulp.task('serve',['watch'], function () {
  browserSync.instance = browserSync.init({
    notify: false,
    startPath: '/',
    server: {
      baseDir: ".tmp"
    },
  });
});