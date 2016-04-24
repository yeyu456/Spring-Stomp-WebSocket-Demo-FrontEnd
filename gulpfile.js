'use strict';

require("babel-polyfill");

let gulp = require('gulp');
let gutil = require('gulp-util');
let sourcemaps = require('gulp-sourcemaps');
let del = require('del');
let path = require('path');

let scriptDir = path.join(__dirname, 'browser', 'scripts');

gulp.task('check', function _check(cb) {
    gulp.src(path.join(scriptDir, '*.js'))
        .pipe(jslint());
});

gulp.task('default', function _default(cb) {
    console.log("test start");
    let a = 1;
    console.log(a);
    cb();
});
