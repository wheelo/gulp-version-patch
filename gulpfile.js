/**
 * @file
 * @author wheelo
 * Created by wheelo on 16/12/31.
 */

var gulp = require('gulp');
var versionPatch = require('./index.js');

// will not patch the image resource, for base64 replacement & etc..
gulp.task('imgs', function () {
    return gulp.src('./test/imgs/*.*')
        .pipe(gulp.dest('./test/dist/imgs'))
});

gulp.task('patchcss', function () {
    return gulp.src('./test/*.css')
        // default: {versionType: '%MD5%', patchMode: 0}
        .pipe(versionPatch())
        .pipe(gulp.dest('./test/dist'))
});

gulp.task('patch', ['imgs', 'patchcss'], function () {
    gulp.src("./test/*.html")
        .pipe(versionPatch({patchMode: 1}))
        .pipe(gulp.dest('./test/dist'));
});



gulp.task('default', ['patch']);


