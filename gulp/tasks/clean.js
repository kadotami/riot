var gulp = require('gulp');
var rimraf = require('rimraf');

gulp.task('clean:src', function () {
  return rimraf('./src/js', function(){console.log('e')});
});