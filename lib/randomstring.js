/*!
 * mktemp Copyright(c) 2013 sasa+1
 * https://github.com/sasaplus1/mktemp
 * Released under the MIT license.
 */


/**
 * generate random string.
 *
 * @param {String} str target string.
 * @return {String} replaced string.
 */
function mkrand(str) {
  var TABLE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      TABLE_LEN = TABLE.length,
      source = String(str),
      match = source.match(/(X+)[^X]*$/),
      i, len, rand;

  if (match === null) {
    return source;
  }

  for (rand = '', i = 0, len = match[1].length; i < len; ++i) {
    rand += TABLE[Math.floor(Math.random() * TABLE_LEN)];
  }

  return source.slice(0, match.index) + rand +
      source.slice(match.index + rand.length);
}


/** export mkrand function. */
module.exports = mkrand;
