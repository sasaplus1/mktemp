// mktemp Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/mktemp
// Released under the MIT License.

var fs = require('fs'),
    path = require('path'),
    mkrand = require('./mkrand');

function createUniqueName(template, callback) {
  var filename = mkrand(template);
  fs.readdir(path.dirname(template), function(err, files) {
    if(err) { callback(err); return; }
    while(files.indexOf(filename) >= 0)
      filename = mkrand(template);
    callback(null, filename);
  });
}

  var filename = mkrand(template),
    files = fs.readdirSync(path.dirname(template));
  while(files.indexOf(filename) >= 0)
function createUniqueNameSync(template) {
    filename = mkrand(template);
  return filename;
}


function createFile(template, callback) {
  createUniqueName(template, function(err, filename){
    if(err) { callback(err); return; }
    fs.open(filename, 'ax+', function(err, fd) {
      if(err) { callback(err); return; }
      fs.close(fd, function(err){
        callback(err, filename);
      });
    });
  });
}

function createFileSync(template) {
  var filename = createUniqueNameSync(template),
    fd = fs.openSync(filename, 'ax+');
  fs.closeSync(fd);
  return filename;
}

function createDir(template, mode, callback) {
  if (typeof mode === 'function' && callback === void 0) {
    callback = mode;
    mode = null;
  }

  createUniqueName(template, function(err, dirname){
    if(err) { callback(err); return; }
    fs.mkdir(dirname, mode, function(err) {
      callback(err, dirname);
    });
  });
}

function createDirSync(template, mode) {
  var dirname = createUniqueNameSync(template);
  fs.mkdirSync(dirname, mode);
  return dirname;
}

module.exports = {
  createFile: createFile,
  createFileSync: createFileSync,
  createDir: createDir,
  createDirSync: createDirSync
};
