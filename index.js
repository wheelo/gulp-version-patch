"use strict";

var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

var gutil = require('gulp-util');
var through = require('through2');

var md5 = require('./lib/md5');
var randomString = require('./lib/randomString');
var leadZero = require('./lib/leadZero');

var PLUGIN_NAME = 'gulp-version-patch';

// var createHash = function (file, len) {
//     return crypto.createHash('md5').update(file).digest('hex').substr(0, len);
// };

function version(v) {

    if ( typeof v === 'undefined') {
        return null;
    }

    if (v.indexOf('%')) {
        v = v.toUpperCase();
    }

    var DT = new Date();
    switch(v) {
        case '%DATE%':
            v = DT.getFullYear() + leadZero(DT.getMonth() + 1, 2) + leadZero(DT.getDate(), 2);
            break;
        case '%DT%':
            v = DT.getFullYear() + leadZero(DT.getMonth() + 1, 2) + leadZero(DT.getDate(), 2) + leadZero(DT.getHours(), 2) + leadZero(DT.getMinutes(), 2) + leadZero(DT.getSeconds(), 2);
            break;
        case '%TS%':
            v = DT.getTime().toString();
            break;
        case '%MD5%':
            v = md5(DT.getTime().toString());
            break;
        case '%MDS%':
            v = md5(md5(DT.getTime().toString()) + randomString(8));
            break;
        default:
            break;
    }

    return v;
}

function assetReg(p) {
    var ASSET_REG = {};
    switch(p) {
            case 1:
                ASSET_REG = {
                    "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig,
                    "STYLESHEET": /(<link[^>]+href=)['"]([^'"]+)["']/ig,
                    "BACKGROUND": /(url\()(?!data:|about:)([^)]*)/ig
                };
                break;
            case 2:
                ASSET_REG = {
                    "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig,
                    "STYLESHEET": /(<link[^>]+href=)['"]([^'"]+)["']/ig
                };
                break;
            case 3:
                ASSET_REG = {
                    "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig
                };
                break;
            case 0:
            default:
                ASSET_REG = {
                    "SCRIPT": /(<script[^>]+src=)['"]([^'"]+)["']/ig,
                    "STYLESHEET": /(<link[^>]+href=)['"]([^'"]+)["']/ig,
                    "IMAGE": /(<img[^>]+src=)['"]([^'"]+)["']/ig,
                    "BACKGROUND": /(url\()(?!data:|about:)([^)]*)/ig
                };
                break;
        }
        return ASSET_REG;
}


module.exports = function (options) {
    return through.obj(function (file, enc, cb) {
        options = options || {};
        options.patchMode = options.patchMode || 0;
        options.versionType = options.versionType || options.versionMode || '%MD5%';

        var versionNum = version(options.versionType);
        if(options.versionType.indexOf('%MD5%') || options.versionType.indexOf('%MDS%')) {
            versionNum = versionNum.substr(0, 8);
        }
        
        var ASSET_REG = assetReg(options.patchMode);
        
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        if (file.isStream()) {
            this.emit('error', new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        var content = file.contents.toString();

        var filePath = path.dirname(file.path);

        for (var type in ASSET_REG) {
            if (type === "BACKGROUND" && !/\.(css|scss|less)$/.test(file.path)) {

            } else {
                content = content.replace(ASSET_REG[type], function (str, tag, src) {
                    src = src.replace(/(^['"]|['"]$)/g, '');

                    if (!/\.[^\.]+$/.test(src)) {
                        return str;
                    }
                    if (options.verStr) {
                        src += options.verStr;
                        return tag + '"' + src + '"';
                    }
                
                    // remote resource
                    if (/^https?:\/\//.test(src)) {
                        return str;
                    }

                    var assetPath = path.join(filePath, src);

                    if (src.indexOf('/') == 0) {
                        if (options.resolvePath && typeof options.resolvePath === "function") {
                            assetPath = options.resolvePath(src);
                        } else {
                            assetPath = (options.rootPath || "") + src;
                        }
                    }

                    if (fs.existsSync(assetPath)) {
                        //var buf = fs.readFileSync(assetPath);
                        //var md5 = createHash(buf, options.hashLen || 7);
                        src += "?v=" + versionNum;
                    } else {
                        return str;
                    }

                    return tag + '"' + src + '"';
                });
            }
        }

        file.contents = new Buffer(content);
        this.push(file);
        cb();
    });
};

