'use strict';

require("babel-polyfill");

const gulp = require('gulp');
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const path = require('path');
const eslint = require('gulp-eslint');

const scriptDir = path.join(__dirname, 'browser', 'scripts');

gulp.task('check', function _check() {
    return gulp.src(path.join(scriptDir, '*.js'))
            .pipe(eslint('./eslintrc'))
            .pipe(eslint.format())
            .pipe(eslint.failAfterError());
});

gulp.task('babel', ['check'], function _es6(cb) {

    cb();
});

gulp.task('default', ['babel'], function _default(cb) {
    cb();
});
