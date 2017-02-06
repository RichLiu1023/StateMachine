/**
 * Created by RichLiu1023
 */
var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('buildDMJS', function () {
    var tsResult = gulp.src(['src/**/*.ts'])
        .pipe(ts({
            target: "ES5",
            declaration: true,
            removeComments: true,//去除注释
            module: "system",
            sortOutput: "true",
            out: "sm.js"
        }));
    return [
        tsResult.js.pipe(gulp.dest('bin/sm')).pipe(rename({ suffix: '.min' })).pipe(uglify()).pipe(gulp.dest('bin/sm')),
        tsResult.dts.pipe(gulp.dest('bin/sm'))
    ];
});

gulp.task('default', ['buildDMJS']);