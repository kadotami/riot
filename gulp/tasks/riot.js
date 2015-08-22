var gulp = require('gulp');
var riot = require('gulp-riot');
var config = require('../config');

gulp.task('riot', function(){
  return gulp.src("./src/tags/*.tag")
    .pipe(riot())
    .pipe(gulp.dest(config.riot.output));
});