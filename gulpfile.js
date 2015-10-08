var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var gutil  = require('gutil');
var rename = require('gulp-rename')
var package_json = require('./package.json')

var paths = {
  scripts: ['lib/**/*.coffee'],
  dest: 'dest'
};

var fileName = 'utm_form' + '-' + package_json.version;
var fullFileName = fileName + '.js';
var minifiedFileName = fileName + '.min.js';

gulp.task('coffee', function() {
  gulp.src(paths.scripts)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat(fullFileName))
    .pipe(gulp.dest(paths.dest))
});

gulp.task('uglify', ['coffee'], function() {
  gulp.src(paths.dest + '/' + fullFileName)
    .pipe(uglify({mangle: false}))
    .pipe(rename(minifiedFileName))
    .pipe(gulp.dest(paths.dest))
});

gulp.task('build', ['coffee', 'uglify'])
