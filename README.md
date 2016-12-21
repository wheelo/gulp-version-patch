## gulp-version-patch

a gulp plugin which patches the included files versions in html & css

## Installation

```bash
npm install gulp-version-patch
```

## Usage

```js
var gulp = require('gulp');
var assetRev = require('gulp-version-patch');

gulp.task('rev',function() {
    gulp.src("./test/test.html")
        .pipe(assetRev())
        .pipe(gulp.dest('./'));
});
```

## Options

### patchMode: control the patch mode
This package includes 4 version patch modes, either the following 4 types could be patched: script, stylesheet, image, background. use it with caution.
#### default: 0


## Example

```js
var gulp = require('gulp');
var assetRev = require('./index.js');
// pacthMode: 1, 2, 3, 4
gulp.task('rev',['revCss'],function() {
    gulp.src("./test/test.html")
        .pipe(assetRev({ patchMode: 1 }))
        .pipe(gulp.dest('./dest'));
});

gulp.task('revCss',function () {
    return gulp.src('./test/styles/test.css')
        .pipe(assetRev())
        .pipe(gulp.dest('./dest/styles/'))
});
gulp.task('default',['rev']);
```






