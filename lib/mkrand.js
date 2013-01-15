// mktemp Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/mktemp
// Released under the MIT License.

module.exports = function(str) {
  var TABLE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      TABLE_LEN = TABLE.length,
      TARGET_REGEXP = /X+$/,
      match = str.match(TARGET_REGEXP),
      i, randomArray;

  if (match === null) {
    return str;
  }

  i = match[0].length;
  randomArray = [];

  for (; i--;) {
    randomArray[i] = TABLE[Math.floor(Math.random() * TABLE_LEN)];
  }

  return str.replace(TARGET_REGEXP, randomArray.join(''));
};
