var assert = require('chai').assert,
    mkrand = require('../lib/mkrand');

suite('mkrand()', function() {

  test('replace "X" in end of line', function() {
    var str = mkrand('XXXXX_XXXXX');

    assert.isTrue(
        /^X{5}_[\da-zA-Z]{5}$/.test(str),
        'str should be match in /^X{5}_[\\da-zA-Z]{5}$/');
    assert.notStrictEqual(
        str,
        'XXXXX_XXXXX',
        'str should not be "XXXXX_XXXXX"');
  });

  test('replace "X" in near end of line', function() {
    var str = mkrand('temp-XXXXX.tmp');

    assert.isTrue(
        /^temp-[\da-zA-Z]{5}\.tmp$/.test(str),
        'str should be match in /^temp-[\\da-zA-Z]{5}\\.tmp$/');
    assert.notStrictEqual(
        str,
        'temp-XXXXX.tmp',
        'str should not be "temp-XXXXX.tmp"');
  });

  test('not replace if string not has "X"', function() {
    assert.strictEqual(
        mkrand('abcde'),
        'abcde',
        'mkrand("abcde") should be returned "abcde"');
  });

});
