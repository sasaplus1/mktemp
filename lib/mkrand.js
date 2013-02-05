// mktemp Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/mktemp
// Released under the MIT License.

module.exports = function(str) {
  var TABLE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      TABLE_LEN = TABLE.length,
      targetStr = String(str),
      result = targetStr.split(''),
      i;

  for (i = targetStr.lastIndexOf('X'); result[i] === 'X'; --i) {
    result[i] = TABLE[Math.floor(Math.random() * TABLE_LEN)];
  }

  return result.join('');
};
