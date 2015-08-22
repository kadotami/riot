var gulp = require('gulp');
var riot = require('gulp-riot');
var config = require('../config');

gulp.task('riot', ['clean:src'], function(){
  return gulp.src("./src/tags/*.tag")
    .pipe(riot())
    .pipe(gulp.dest(config.riot.output));
});