var assert = require('chai').assert,
    mkrand = require('../lib/mkrand');

suite('mkrandのテスト', function() {

  test('"X"の数だけ0-9a-zA-Zのランダムな文字列に置換されること', function() {
    var randomString = mkrand('XXXXX');

    assert.isTrue(/^[\da-zA-Z]{5}$/.test(randomString),
        'replace to random string from "XXXXX"');
    assert.notStrictEqual(randomString, 'XXXXX',
        'randomString is not "XXXXX"');
  });

  test('"X"が複数ある場合、末尾の"X"が優先的に置換されること', function() {
    var randomString = mkrand('XXXXX_XXXXX');

    assert.isTrue(/^X{5}_[\da-zA-Z]{5}$/.test(randomString),
        'replace to random string from XXXXX');
    assert.notStrictEqual(randomString, 'XXXXX_XXXXX',
        'randomString is not "XXXXX_XXXXX"');
  });

  test('"X"が末尾で無くても置換されること', function() {
    var randomString = mkrand('temp-XXXXX.tmp');

    assert.isTrue(/^temp-[\da-zA-Z]{5}\.tmp$/.test(randomString),
        'replace to random string from temp-XXXXX.tmp');
    assert.notStrictEqual(randomString, 'temp-XXXXX.tmp',
        'randomString is not "temp-XXXXX.tmp"');
  });

  test('"X"が無い場合置換されないこと', function() {
    assert.strictEqual(mkrand('abcdef'), 'abcdef',
        'randomString is not replaced');
  });

});
