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
const webpack = require('webpack');

//Path
const webpackConf = require('./webpack.config.js');
const script = path.join(__dirname, 'browser', 'scripts', '**', '*.js');
const srcPath = path.join(__dirname, 'browser');
const buildPath = path.join(__dirname, 'build');
const resources = [path.join(srcPath, '*.html')];
const buildScriptDir = path.join(buildPath, 'scripts');



gulp.task('start', function _start() {
    gutil.log("\n\n*************Starting Build.*************\n\n");
});

gulp.task('clean', ['start'], function _clean(cb) {
    del.sync([buildScriptDir]);
    cb();
});

gulp.task('check', ['start'], function _check(cb) {
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
});

gulp.task('build', ['clean', 'check'], function _build(cb) {

    webpack(webpackConf, function _webpack(err, stats) {
        if (err) {
            gutil.log("[webpack] Error:", err);
            cb(err);

        } else {
            gutil.log("[webpack] Success", stats.toString());
            cb();
        }
    });
});

gulp.task('default', ['build', 'copy'], function _default() {
    gutil.log("\n\n*************Ending Build.*************\n\n");
});

gulp.task('watch', function _watch() {
    gulp.watch(script, ['build']);
});
