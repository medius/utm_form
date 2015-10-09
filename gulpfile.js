var gulp = require('gulp');
var clean = require('gulp-clean');
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

gulp.task('clean', function() {
  gulp.src(paths.dest)
    .pipe(clean())
});

gulp.task('build', ['clean'], function() {
  gulp.src(paths.scripts)
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(concat(fullFileName))
    .pipe(gulp.dest(paths.dest))
    .pipe(uglify({mangle: false}))
    .pipe(rename(minifiedFileName))
    .pipe(gulp.dest(paths.dest))
});
