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


gulp.task('patchcss', function () {
    return gulp.src('./test/*.css')
     	// default: {versionType: '%MD5%', patchMode: 0}
        .pipe(versionPatch({versionType: '%DT%'}))
        .pipe(gulp.dest('./test/dist'))
});

// will not patch the image resource, for base64 replacement & etc..
gulp.task('patch', ['patchcss'], function () {
    gulp.src("./test/*.html")
        .pipe(versionPatch({patchMode: 1}))
        .pipe(gulp.dest('./test/dist'));
});

gulp.task('default', ['patch']);
```
#### Notice: the file generated will have the shape of `?v=abcd123` as suffix.

## Options

**Patch Modes**

When using this patch plugin you might specify the param `{ patchMode: MODE }` to indicate the patch mode. There are 4 patching modes avaibale right now. Either of 4 resources type could be version-patched: script, stylesheet and image resource reference(in html) and background url (in css/less). Hence the params of `MODE` can be chosen from `0, 1, 2, 3` as follows: 

- `0`: patch all above four patched types in both html and css
- `1`: not patch the image resource 
- `2`: only patch the script and css
- `3`: only patch the script

You can also omit this params for the mode of `0`

**Version Types**

When the 'gulp-version-patch' package comes to the version 0.5.0. We have another feature to specify the patching version. You might specify the param `{ versionType: TYPE }` to indicate the patched version type. Either of date, time, MD5 can be indicated. Moreover, you can specify your DIY type for patching (i.e. the last one as follows). The param `TYPE` can be chosen one of `0, 1, 2, 3, 4`.

- `%DATE%`  date [**YYYYMMDD**]
- `%DT%`  date + time [**YYYYMMDDHHIISS**]
- `%TS%`  timestamp [**INT**10]
- `%TSM%`  timestamp(millisecond) [**INT**13]
- `%MD5%`  MD5(timestamp) [**STRING**32]
- `%MDS%`  MD5(MD5(timestamp) + salt) [**STRING**32]
- `{STRING}`  In addition to the above keywords, considered custom

When you omit the param versionType, the module will use the default type `%MD5%` to patch resources.



