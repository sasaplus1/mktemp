/*!
 * mktemp Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/mktemp
 * Released under the MIT license.
 */

var fs = require('fs'),
    mkrand = require('./mkrand');


/**
 * create unique name file.
 *
 * @param {String} template template string.
 * @param {Function} callback callback function.
 */
function createFile(template, callback) {
  var filename = mkrand(template);

  fs.open(filename, 'ax+', 384 /*=0600*/, function(err, fd) {
    if (err) {
      if (err.code === 'EEXIST') {
        // FIXME: infinite loop
        createFile(template, callback);
        return;
      }

      filename = null;
    }

    if (fd) {
      fs.close(fd, function(err) {
        callback(err, filename);
      });
    } else {
      callback(err, filename);
    }
  });
}


/**
 * sync version createFile.
 *
 * @param {String} template template string.
 * @throws {Error} error of fs.openSync or fs.closeSync.
 * @return {String} created filename.
 */
function createFileSync(template) {
  var overlap, filename, fd;

  // FIXME: infinite loop
  do {
    overlap = false;
    filename = mkrand(template);
    try {
      fd = fs.openSync(filename, 'ax+', 384 /*=0600*/);
    } catch (e) {
      if (e.code === 'EEXIST') {
        overlap = true;
      } else {
        throw e;
      }
    } finally {
      fd && fs.closeSync(fd);
    }
  } while (overlap);

  return filename;
}


/**
 * create unique name dir.
 *
 * @param {String} template template string.
 * @param {Function} callback callback function.
 */
function createDir(template, callback) {
  var dirname = mkrand(template);

  fs.mkdir(dirname, 448 /*=0700*/, function(err) {
    if (err) {
      if (err.code === 'EEXIST') {
        // FIXME: infinite loop
        createDir(template, callback);
        return;
      }

      dirname = null;
    }

    callback(err, dirname);
  });
}


/**
 * sync version createDir.
 *
 * @param {String} template template string.
 * @return {String} created dirname.
 */
function createDirSync(template) {
  var overlap, dirname;

  // FIXME: infinite loop
  do {
    overlap = false;
    dirname = mkrand(template);
    try {
      fs.mkdirSync(dirname, 448 /*=0700*/);
    } catch (e) {
      if (e.code === 'EEXIST') {
        overlap = true;
      } else {
        throw e;
      }
    }
  } while (overlap);

  return dirname;
}


/** export functions. */
module.exports = {
  createFile: createFile,
  createFileSync: createFileSync,
  createDir: createDir,
  createDirSync: createDirSync
};
