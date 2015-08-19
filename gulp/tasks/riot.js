var gulp = require('gulp');
var riot = require('gulp-riot');

gulp.task('riot', function(){
  gulp.src("./tags/*.tag")
    .pipe(riot())
    .pipe(gulp.dest('dest'));
});