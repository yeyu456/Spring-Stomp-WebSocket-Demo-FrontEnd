'use strict';

//Base Module
require("babel-polyfill");
const gulp = require('gulp');
const path = require('path');

//Clean Module
const del = require('del');

//Check Module
const eslint = require('gulp-eslint');

//Build Module
const gutil = require('gulp-util');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');


const script = path.join(__dirname, 'browser', 'scripts', '**', '*.js');
const buildPath = path.join(__dirname, 'build');
const buildScriptDir = path.join(buildPath, 'scripts');
const resources = [path.join(buildPath, '*.html')];

gulp.task('clean', function _clean(cb) {
    del.sync([buildScriptDir]);
    cb();
});

gulp.task('check', function _check(cb) {
    gulp.src(script)
        .pipe(eslint('./.eslintrc'))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
    cb();
});

gulp.task('copy', ['clean'], function _copy(cb) {
    gulp.src(resources)
        .pipe(gulp.dest(buildPath));
    cb();
})

gulp.task('build', ['clean', 'check'], function _es6(cb) {
    gulp.src(script)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets : ['es2015'],
            sourceMap: "inline",}))
        .pipe(concat('chat.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildScriptDir));
    cb();
});

gulp.task('default', ['build', 'copy'], function _default(cb) {
    cb();
});
