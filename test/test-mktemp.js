var fs = require('fs'),
    assert = require('chai').assert,
    sinon = require('sinon'),
    mktemp = require('../lib/mktemp');

suite('mktemp', function() {

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

  suite('#createUniqueName()', function() {

    test('generate unique name', function(done) {
      mktemp.createUniqueName('XXX-XXXXX', function(err, path) {
        assert.isTrue(
            /^X{3}-[\da-zA-Z]{5}$/.test(path),
            'path should be match in /^X{3}-[\\da-zA-Z]{5}$/');
        assert.notStrictEqual(
            path,
            'XXX-XXXXX',
            'path should not be "XXX-XXXXX"');
        done();
      });
    });

  });

  suite('#createUniqueNameSync()', function() {

    test('generate unique name', function() {
      var path = mktemp.createUniqueNameSync('XXX-XXXXX');

      assert.isTrue(
          /^X{3}-[\da-zA-Z]{5}$/.test(path),
          'path should be match in /^X{3}-[\\da-zA-Z]{5}$/');
      assert.notStrictEqual(
          path,
          'XXX-XXXXX',
          'path should not be "XXX-XXXXX"');
    });

  });

  suite('#createFile()', function() {

    test('generate random filename', function(done) {
      mktemp.createFile('file-XXXXX', function(err, path) {
        assert.isTrue(
            /^file-[\da-zA-Z]{5}$/.test(path),
            'path should be match in /^file-[\\da-zA-Z]{5}$/');
        assert.notStrictEqual(
            path,
            'file-XXXXX',
            'path should not be "file-XXXXX"');
        done();
      });
    });

  });

  suite('#createFileSync()', function() {

    test('generate random filename', function() {
      var path = mktemp.createFileSync('file-XXX');

      assert.isTrue(
          /^file-[\da-zA-Z]{3}$/.test(path),
          'path should be match in /^file-[\\da-zA-Z]{3}$/');
      assert.notStrictEqual(
          path,
          'file-XXX',
          'path should not be "file-XXX"');
    });

  });

  suite('#createDir()', function() {

    test('generate random dirname', function(done) {
      mktemp.createDir('dir-XXXXX', function(err, path) {
        assert.isTrue(
            /^dir-[\da-zA-Z]{5}$/.test(path),
            'path should be match in /^dir-[\\da-zA-Z]{5}$/');
        assert.notStrictEqual(
            path,
            'dir-XXXXX',
            'path should not be "dir-XXXXX"');
        done();
      });
    });

  });

  suite('#createDirSync()', function() {

    test('generate random dirname', function() {
      var path = mktemp.createDirSync('dir-XXX');

      assert.isTrue(
          /^dir-[\da-zA-Z]{3}$/.test(path),
          'path should be match in /^dir-[\\da-zA-Z]{3}$/');
      assert.notStrictEqual(
          path,
          'dir-XXX',
          'path should not be "dir-XXX"');
    });

  });

});
