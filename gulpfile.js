var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil  = require('gutil');

var paths = {
  scripts: ['lib/**/*.coffee'],
  dest: 'dest'
};

gulp.task('coffee', function() {
  gulp.src(paths.scripts)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat('utm_form.js'))
    .pipe(gulp.dest(paths.dest))
});
