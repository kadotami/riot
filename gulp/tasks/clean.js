var gulp = require('gulp');
var rimraf = require('rimraf');

gulp.task('clean:src', function () {
  rimraf('./src/js', function(){console.log('error')});
});