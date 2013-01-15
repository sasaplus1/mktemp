var fs = require('fs'),
    assert = require('chai').assert,
    sinon = require('sinon'),
    mktemp = require('../');

suite('mktempのテスト', function() {

  suiteSetup(function() {
    sinon.stub(fs, 'writeFile').callsArgWith(2, null);
    sinon.stub(fs, 'writeFileSync');
    sinon.stub(fs, 'mkdir').callsArgWith(2, null);
    sinon.stub(fs, 'mkdirSync');
  });

  suiteTeardown(function() {
    fs.writeFile.restore();
    fs.writeFileSync.restore();
    fs.mkdir.restore();
    fs.mkdirSync.restore();
  });

  test('createFileのテスト', function(done) {
    mktemp.createFile('file-XXXXX', function(err, path) {
      assert.isTrue(/^file-[\da-zA-Z]{5}$/.test(path),
          'create file of random filename');
      done();
    });
  });

  test('createFileSyncのテスト', function() {
    assert.isTrue(
        /^file-[\da-zA-Z]{3}$/.test(mktemp.createFileSync('file-XXX')),
        'create file of random filename');
  });

  test('createDirのテスト', function(done) {
    mktemp.createDir('dir-X', function(err, path) {
      assert.isTrue(/^dir-[\da-zA-Z]$/.test(path),
          'create dir of random dirname');
      done();
    });
  });

  test('createDirSyncのテスト', function() {
    assert.isTrue(
        /^dir-[\da-zA-Z]{7}$/.test(mktemp.createDirSync('dir-XXXXXXX')),
        'create dir of random dirname');
  });

});
