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
    } else {
      callback(null, filename);
    }
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
  var filename = createUniqueNameSync(template);

  try {
    fs.closeSync(fs.openSync(filename, 'ax+', 384 /*=0600*/));
  } catch (e) {
    throw e;
  }

  return filename;
}

function createDir(template, callback) {
  createUniqueName(template, function(err, dirname) {
    if (err) {
      callbacke(err);
      return;
    }

    fs.mkdir(dirname, 448 /*=0700*/, function(err) {
      callback(err, dirname);
    });
  });
}

function createDirSync(template) {
  var dirname = createUniqueNameSync(template);

  fs.mkdirSync(dirname, 448 /*=0700*/);

  return dirname;
}

module.exports = {
  createFile: createFile,
  createFileSync: createFileSync,
  createDir: createDir,
  createDirSync: createDirSync
};
