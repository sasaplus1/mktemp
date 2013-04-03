var fs = require('fs'),
    assert = require('chai').assert,
    sinon = require('sinon'),
    mktemp = require('../');

suite('mktempのテスト', function() {

  suiteSetup(function() {
    sinon.stub(fs, 'open').callsArgWith(3, null);
    sinon.stub(fs, 'close').callsArgWith(1, null);
    sinon.stub(fs, 'openSync');
    sinon.stub(fs, 'closeSync');
    sinon.stub(fs, 'mkdir').callsArgWith(2, null);
    sinon.stub(fs, 'mkdirSync');
  });

  suiteTeardown(function() {
    fs.open.restore();
    fs.openSync.restore();
    fs.close.restore();
    fs.closeSync.restore();
    fs.mkdir.restore();
    fs.mkdirSync.restore();
  });

  test('createFileのテスト', function(done) {
    mktemp.createFile('file-XXXXX', function(err, path) {
      assert.isTrue(/^file-[\da-zA-Z]{5}$/.test(path),
          'create file of random filename');
      assert.isFalse(/^file-X{5}$/.test(path),
          'path is replaced to random filename');
      done();
    });
  });

  test('createFileSyncのテスト', function() {
    var path = mktemp.createFileSync('file-XXX');

    assert.isTrue(/^file-[\da-zA-Z]{3}$/.test(path),
        'create file of random filename');
    assert.isFalse(/^file-X{3}$/.test(path),
        'path is replaced to random filename');
  });

  test('createDirのテスト', function(done) {
    mktemp.createDir('dir-X', function(err, path) {
      assert.isTrue(/^dir-[\da-zA-Z]$/.test(path),
          'create dir of random dirname');
      assert.isFalse(/^dir-X$/.test(path),
          'path is replaced to random dirname');
      done();
    });
  });

  test('createDirSyncのテスト', function() {
    var path = mktemp.createDirSync('dir-XXXXXXX');

    assert.isTrue(/^dir-[\da-zA-Z]{7}$/.test(path),
        'create dir of random dirname');
    assert.isFalse(/^dir-X{7}$/.test(path),
        'path is replaced to random dirname');
  });

});
