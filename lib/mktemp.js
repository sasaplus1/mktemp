// mktemp Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/mktemp
// Released under the MIT License.

var fs = require('fs'),
    mkrand = require('./mkrand');

function createUniqueName(template, callback) {
  var filename = mkrand(template);

  fs.exists(filename, function(exists) {
    if (exists) {
      createUniqueName(template, callback);
      return;
    }

    callback(null, filename);
  });
}

function createUniqueNameSync(template) {
  var filename;

  do {
    filename = mkrand(template);
  } while (fs.existsSync(filename));

  return filename;
}


function createFile(template, callback) {
  createUniqueName(template, function(err, filename) {
    if (err) {
      callback(err);
      return;
    }

    fs.open(filename, 'ax+', 384 /*=0600*/, function(err, fd) {
      if (err) {
        callback(err);
        return;
      }

      fs.close(fd, function(err) {
        callback(err, filename);
      });
    });
  });
}

function createFileSync(template) {
  var filename = createUniqueNameSync(template),
      fd = fs.openSync(filename, 'ax+', 384 /*=0600*/);

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
