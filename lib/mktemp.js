/*!
 * mktemp Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/mktemp
 * Released under the MIT License.
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
  createUniqueName_(template, function(err, filename) {
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


/**
 * sync version createFile.
 *
 * @param {String} template template string.
 * @throws {Error} error of fs.openSync or fs.closeSync.
 * @return {String} created filename.
 */
function createFileSync(template) {
  var filename = createUniqueNameSync_(template);

  try {
    fs.closeSync(fs.openSync(filename, 'ax+', 384 /*=0600*/));
  } catch (e) {
    throw e;
  }

  return filename;
}


/**
 * create unique name dir.
 *
 * @param {String} template template string.
 * @param {Function} callback callback function.
 */
function createDir(template, callback) {
  createUniqueName_(template, function(err, dirname) {
    if (err) {
      callback(err);
      return;
    }

    fs.mkdir(dirname, 448 /*=0700*/, function(err) {
      callback(err, dirname);
    });
  });
}


/**
 * sync version createDir.
 *
 * @param {String} template template string.
 * @throws {Error} error of fs.mkdirSync.
 * @return {String} created filename.
 */
function createDirSync(template) {
  var dirname = createUniqueNameSync_(template);

  try {
    fs.mkdirSync(dirname, 448 /*=0700*/);
  } catch (e) {
    throw e;
  }

  return dirname;
}


/**
 * create unique name.
 *
 * @private
 * @param {String} template template string.
 * @param {Function} callback callback function.
 */
function createUniqueName_(template, callback) {
  var filename = mkrand(template);

  // FIXME: infinite loop
  fs.exists(filename, function(exists) {
    if (exists) {
      createUniqueName(template, callback);
    } else {
      callback(null, filename);
    }
  });
}


/**
 * sync version createUniqueName.
 *
 * @private
 * @param {String} template template string.
 * @return {String} replaced from template.
 */
function createUniqueNameSync_(template) {
  var filename;

  // FIXME: infinite loop
  do {
    filename = mkrand(template);
  } while (fs.existsSync(filename));

  return filename;
}


/**
 * export private functions if NODE_ENV variable is test.
 * otherwise export public functions.
 */
module.exports =
    (process.env.NODE_ENV === 'test') ? {
      createFile: createFile,
      createFileSync: createFileSync,
      createDir: createDir,
      createDirSync: createDirSync,
      createUniqueName_: createUniqueName_,
      createUniqueNameSync_: createUniqueNameSync_
    } : {
      createFile: createFile,
      createFileSync: createFileSync,
      createDir: createDir,
      createDirSync: createDirSync
    };
