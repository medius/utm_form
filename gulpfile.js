var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil  = require('gutil');
var rename = require('gulp-rename')

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

gulp.task('uglify', function() {
  gulp.src(paths.dest + '/utm_form.js')
    .pipe(uglify())
    .pipe(rename('utm_form.min.js'))
    .pipe(gulp.dest(paths.dest))
});

gulp.task('build', ['coffee', 'uglify'])
