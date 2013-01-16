var assert = require('chai').assert,
    mkrand = require('../lib/mkrand');

suite('mkrandのテスト', function() {

  test('"X"の数だけ0-9a-zA-Zのランダムな文字列に置換されること', function() {
    var randomString = mkrand('XXXXX');

    assert.isTrue(/[\da-zA-Z]{5}/.test(randomString),
        'replace to random string from "XXXXX"');
    assert.notStrictEqual(randomString, 'XXXXX',
        'randomString is not "XXXXX"');
  });

  test('"X"が末尾にない場合は置換されないこと', function() {
    assert.strictEqual(mkrand('XXXXX_'), 'XXXXX_',
        'randomString is not replaced');
  });

});
