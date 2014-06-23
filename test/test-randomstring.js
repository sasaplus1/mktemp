var expect = require('expect.js'),
    mkrand = require('../lib/mkrand');

describe('mkrand', function() {

  it('should replace "X", and matching to /^X{5}_[\\da-zA-Z]{5}$/', function() {
    expect(mkrand('XXXXX_XXXXX')).to.match(/^X{5}_[\da-zA-Z]{5}$/);
  });

  it('should replace "X", and matching to /^[\\da-zA-Z]{5}.tmp$/', function() {
    expect(mkrand('XXXXX.tmp')).to.match(/^[\da-zA-Z]{5}.tmp$/);
  });

  it('should not replace if parameter not has "X"', function() {
    expect(mkrand('abcdef')).to.be('abcdef');
  });

});
