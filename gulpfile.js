'use strict';

require("babel-polyfill");

const gulp = require('gulp');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const path = require('path');
const eslint = require('gulp-eslint');

const scriptDir = path.join(__dirname, 'browser', 'scripts');

gulp.task('check', function _check(cb) {
    return gulp.src(path.join(scriptDir, '*.js'))
            .pipe(eslint('./'))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

gulp.task('babel')

gulp.task('default', ['check'], function _default(cb) {
    cb();
});
