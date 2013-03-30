// mktemp Copyright(c) 2013 sasa+1
// https://github.com/sasaplus1/mktemp
// Released under the MIT License.

module.exports = function(str) {
  var TABLE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      TABLE_LEN = TABLE.length,
      targetStr = '' + str;

  return targetStr.replace(/(X+)[^X]*$/g, function(match){
    return match.replace(/X/g, function(){
      return TABLE[0 | Math.random() * TABLE_LEN];
    });
  });
};
