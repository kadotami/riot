var gulp = require('gulp');


gulp.task('watch', ['webpack'], function(){
  gulp.watch('./src/tags/*.tag', ['webpack']);
  gulp.watch('./src/app.js', ['webpack']);
  gulp.watch('./index.html', ['index_copy']);
});