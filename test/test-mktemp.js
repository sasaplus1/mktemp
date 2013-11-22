var fs = require('fs'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    mktemp = require('../lib/mktemp');

describe('mktemp', function() {

  describe('#createFile()', function() {

    describe('success', function() {

      before(function() {
        sinon.stub(fs, 'open').callsArgWith(3, null);
        sinon.stub(fs, 'close').callsArgWith(1, null);
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should create file of random name', function(done) {
        mktemp.createFile('file-XXXXX', function(err, path) {
          expect(path).to.match(/^file-[\da-zA-Z]{5}$/);
          expect(path).not.to.be('file-XXXXX');
          done();
        });
      });

    });

    describe('has error, err.code is EEXIST', function() {

      before(function() {
        var transientObject = {
          getCount: 0
        };

        Object.defineProperty(transientObject, 'code', {
          get: function() {
            // return 'EEXIST' if first call
            return (this.getCount++ > 0) ? null : 'EEXIST';
          }
        });

        sinon.stub(fs, 'open').callsArgWith(3, transientObject);
        sinon.stub(fs, 'close').callsArgWith(1, transientObject);
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should once more call for callback', function(done) {
        mktemp.createFile('', function(err, path) {
          expect(err.getCount).to.be(2);
          expect(err.code).to.be(null);
          expect(path).to.be(null);
          done();
        });
      });

    });

    describe('has error, err.code is not EEXIST', function() {

      before(function() {
        sinon.stub(fs, 'open').callsArgWith(3, {code: 'ENOENT'});
        sinon.stub(fs, 'close').callsArgWith(1, {code: 'ENOENT'});
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should set error to err and set null to path', function(done) {
        mktemp.createFile('', function(err, path) {
          expect(err).to.eql({code: 'ENOENT'});
          expect(path).to.be(null);
          done();
        });
      });

    });

  });

  describe('#createFileSync()', function() {

    describe('success', function() {

      before(function() {
        sinon.stub(fs, 'openSync').returns(1);
        sinon.stub(fs, 'closeSync').returns(1);
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should create file of random name', function() {
        expect(mktemp.createFileSync('XXX')).to.match(/^[\da-zA-Z]{3}$/);
        expect(mktemp.createFileSync('XXX')).not.to.be('XXX');
      });

    });

    describe('throws error, err.code is EEXIST', function() {

      before(function() {
        var transientObject = {
          getCount: 0
        };

        Object.defineProperty(transientObject, 'code', {
          get: function() {
            // return 'EEXIST' if first call
            return (this.getCount++ > 0) ? null : 'EEXIST';
          }
        });

        sinon.stub(fs, 'openSync').throws(transientObject);
        sinon.stub(fs, 'closeSync').throws(transientObject);
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should once more call for fs.openSync', function() {
        expect(function() {
          mktemp.createFileSync('');
        }).to.throwError(function(e) {
          expect(e.getCount).to.be(2);
          expect(e.code).to.be(null);
        });
      });

    });

    describe('throws error, err.code is not EEXIST', function() {

      before(function() {
        sinon.stub(fs, 'openSync').throws({code: 'ENOENT'});
        sinon.stub(fs, 'closeSync').throws({code: 'ENOENT'});
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should throws error of fs.openSync', function() {
        expect(function() {
          mktemp.createFileSync('');
        }).to.throwError(function(e) {
          expect(e.code).to.be('ENOENT');
        });
      });

    });

  });

  describe('#createDir()', function() {

    describe('success', function() {

      before(function() {
        sinon.stub(fs, 'mkdir').callsArgWith(2, null);
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should create directory of random name', function(done) {
        mktemp.createDir('dir-XXXXX', function(err, path) {
          expect(path).to.match(/^dir-[\da-zA-Z]{5}$/);
          expect(path).not.to.be('dir-XXXXX');
          done();
        });
      });

    });

    describe('has error, err.code is EEXIST', function() {

      before(function() {
        var transientObject = {
          getCount: 0
        };

        Object.defineProperty(transientObject, 'code', {
          get: function() {
            // return 'EEXIST' if first call
            return (this.getCount++ > 0) ? null : 'EEXIST';
          }
        });

        sinon.stub(fs, 'mkdir').callsArgWith(2, transientObject);
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should once more call for callback', function(done) {
        mktemp.createDir('', function(err, path) {
          expect(err.getCount).to.be(2);
          expect(path).to.be(null);
          done();
        });
      });

    });

    describe('has error, err.code is not EEXIST', function() {

      before(function() {
        sinon.stub(fs, 'mkdir').callsArgWith(2, {code: 'ENOENT'});
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should set error to err and set null to path', function(done) {
        mktemp.createDir('', function(err, path) {
          expect(err).to.eql({code: 'ENOENT'});
          expect(path).to.be(null);
          done();
        });
      });

    });

  });

  describe('#createDirSync()', function() {

    describe('success', function() {

      before(function() {
        sinon.stub(fs, 'mkdirSync');
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should create directory of random name', function() {
        expect(mktemp.createDirSync('XXX')).to.match(/^[\da-zA-Z]{3}$/);
        expect(mktemp.createDirSync('XXX')).to.not.be('XXX');
      });

    });

    describe('throws error, err.code is EEXIST', function() {

      before(function() {
        var transientObject = {
          getCount: 0
        };

        Object.defineProperty(transientObject, 'code', {
          get: function() {
            // return 'EEXIST' if first call
            return (this.getCount++ > 0) ? null : 'EEXIST';
          }
        });

        sinon.stub(fs, 'mkdirSync').throws(transientObject);
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should once more call for fs.mkdirSync', function() {
        expect(function() {
          mktemp.createDirSync('');
        }).to.throwError(function(e) {
          expect(e.getCount).to.be(2);
          expect(e.code).to.be(null);
        });
      });

    });

    describe('throws error, err.code is not EEXIST', function() {

      before(function() {
        sinon.stub(fs, 'mkdirSync').throws({code: 'ENOENT'});
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should throws error of fs.mkdirSync', function() {
        expect(function() {
          mktemp.createFileSync('');
        }).to.throwError(function(e) {
          expect(e.code).to.be('ENOENT');
        });
      });

    });

  });

});
