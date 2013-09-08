var fs = require('fs'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    mktemp = require('../lib/mktemp');

describe('mktemp', function() {

  before(function() {
    sinon.stub(fs, 'open').callsArgWith(3, null);
    sinon.stub(fs, 'close').callsArgWith(1, null);
    sinon.stub(fs, 'openSync');
    sinon.stub(fs, 'closeSync');
    sinon.stub(fs, 'mkdir').callsArgWith(2, null);
    sinon.stub(fs, 'mkdirSync');
  });

  after(function() {
    fs.open.restore();
    fs.openSync.restore();
    fs.close.restore();
    fs.closeSync.restore();
    fs.mkdir.restore();
    fs.mkdirSync.restore();
  });

  describe('#createFile()', function() {

    it('should create file of random name', function(done) {
      mktemp.createFile('file-XXXXX', function(err, path) {
        expect(path).to.match(/^file-[\da-zA-Z]{5}$/);
        done();
      });
    });

  });

  describe('#createFileSync()', function() {

    it('should create file of random name', function() {
      expect(mktemp.createFileSync('XXX')).to.match(/^[\da-zA-Z]{3}$/);
    });

  });

  describe('#createDir()', function() {

    it('should create directory of random name', function(done) {
      mktemp.createDir('dir-XXXXX', function(err, path) {
        expect(path).to.match(/^dir-[\da-zA-Z]{5}$/);
        done();
      });
    });

  });

  describe('#createDirSync()', function() {

    it('should create directory of random name', function() {
      expect(mktemp.createDirSync('XXX')).to.match(/^[\da-zA-Z]{3}$/);
    });

  });

  describe('#createUniqueName_()', function() {

    it('should create unique name', function(done) {
      mktemp.createUniqueName_('XXX-XXXXX', function(err, path) {
        expect(path).to.match(/^X{3}-[\da-zA-Z]{5}$/);
        done();
      });
    });

  });

  describe('#createUniqueNameSync_()', function() {

    it('should create unique name', function() {
      expect(
          mktemp.createUniqueNameSync_('XXX-XXXXX')
      ).to.match(/^X{3}-[\da-zA-Z]{5}$/);
    });

  });

});
