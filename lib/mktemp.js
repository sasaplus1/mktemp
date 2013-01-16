// mktemp Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/mktemp
// Released under the MIT License.

var fs = require('fs'),
    mkrand = require('./mkrand');

module.exports.createFile = function(path, callback) {
  var filename = mkrand(path);

  fs.writeFile(filename, '', function(err) {
    callback(err, filename);
  });
};

module.exports.createFileSync = function(path) {
  var filename = mkrand(path);

  fs.writeFileSync(filename, '');
  return filename;
};

module.exports.createDir = function(path, mode, callback) {
  var dirname = mkrand(path);

  if (typeof mode === 'function' && callback === void 0) {
    callback = mode;
    mode = 511; /*=0777*/
  }

  fs.mkdir(dirname, mode, function(err) {
    callback(err, dirname);
  });
};

module.exports.createDirSync = function(path, mode) {
  var dirname = mkrand(path);

  fs.mkdirSync(dirname, mode || 511 /*=0777*/);
  return dirname;
};
