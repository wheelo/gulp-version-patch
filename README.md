## gulp-version-patch

A gulp plugin which patches the version of included resource files in html & css file

## Installation

```bash
npm install gulp-version-patch
```

## Usage

```js
var gulp = require('gulp');
var versionPatch = require('gulp-version-patch');

gulp.task('rev',function() {
    gulp.src("./test/test.html")
        .pipe(versionPatch())
        .pipe(gulp.dest('./'));
});
```

## Notice
the file generated will have the shape of `?v=abcd123` as suffix.

## Options

### patchMode: control the patch mode
This package includes 4 version patch modes, either the following 4 types could be patched: script, stylesheet, image, background. 

* 0: patch all above four patched types in both html and css
* 1: not include the image resource patched process
* 2: only ipatch the script and css in html 
* 3: only patch the script in html 

#### default: 0
use it with the param { patchMode: TYPE }, the `TYPE` is either `0, 1, 2, 3, 4`

## Example

```js
var gulp = require('gulp');
var versionPatch = require('gulp-version-patch');
// will not patch the image resource
gulp.task('patch',['patchCss'],function() {
    gulp.src("./test/test.html")
        .pipe(versionPatch({ patchMode: 1 }))
        .pipe(gulp.dest('./dest'));
});

gulp.task('patchCss',function () {
    return gulp.src('./test/styles/test.css')
        .pipe(versionPatch())
        .pipe(gulp.dest('./dest/styles/'))
});

gulp.task('default',['patch']);
```


