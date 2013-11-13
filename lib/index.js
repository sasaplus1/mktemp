/*!
 * mktemp Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/mktemp
 * Released under the MIT license.
 */

var mktemp = require('./mktemp');


/** export mktemp public functions. */
module.exports = {
  createFile: mktemp.createFile,
  createFileSync: mktemp.createFileSync,
  createDir: mktemp.createDir,
  createDirSync: mktemp.createDirSync
};
