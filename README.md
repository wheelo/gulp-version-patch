## gulp-version-patch

A gulp plugin which patches the version of included resource files in html & css files

## Installation

```bash
npm install gulp-version-patch
```

## Usage

```js
var gulp = require('gulp');
var versionPatch = require('gulp-version-patch');

gulp.task('patchVersion',function() {
    gulp.src("./test/test.html")
        .pipe(versionPatch())
        .pipe(gulp.dest('./'));
});
```
#### Notice: the file generated will have the shape of `?v=abcd123` as suffix.

## Options

**Patch Modes**

When using this patch plugin you might specify the param `{ patchMode: TYPE }` to indicate the patch mode, the `TYPE` mode can be chosen one of `0, 1, 2, 3, 4`.
There are 4 patching modes avaibale right now. Either of the following 4 resources type could be version-patched: script, stylesheet and image resource reference in html and background url in css/less. 

- 0: patch all above four patched types in both html and css
- 1: not patch the image resource 
- 2: only patch the script and css
- 3: only patch the script

##### default: 0

**Version Modes**

- %DATE%: date [**YYYYMMDD**]
- %DT%: date + time [**YYYYMMDDHHIISS**]
- %TS%: timestamp [**INT**10]
- %TSM%: timestamp(millisecond) [**INT**13]
- %MD5%: MD5(timestamp) [**STRING**32]
- %MDS%: MD5(MD5(timestamp) + salt) [**STRING**32]
- {STRING}: In addition to the above keywords, considered custom

##### default: %MD5%

## Example

```js
gulp.task('patch', ['patchCss'], function () {
    gulp.src("./test/*.html")
        .pipe(versionPatch({ patchMode: 1 }))
        .pipe(gulp.dest('./test/dist'));
});

gulp.task('patchCss', function () {
    return gulp.src('./test/*.css')
        .pipe(versionPatch({versionMode: '%MD5%'}))
        .pipe(gulp.dest('./test/dist'))
});

gulp.task('default', ['patch']);
```


