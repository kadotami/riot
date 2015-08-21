var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

gulp.task('watch', ['webpack', 'inject'], function(){
  gulp.watch('./src/tags/*.tag', ['webpack', 'inject']);
});