var fs = require('fs'),
    expect = require('expect.js'),
    sinon = require('sinon'),
    mktemp = require('../lib/mktemp');

describe('mktemp', function() {

  describe('#createFile()', function() {

    describe('case in success', function() {

      before(function() {
        // callback's err is always null
        sinon.stub(fs, 'open').callsArgWith(3, null);
        sinon.stub(fs, 'close').callsArgWith(1, null);
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should created file of random name', function(done) {
        mktemp.createFile('XXXXX.tmp', function(err, path) {
          expect(path).to.match(/^[\da-zA-Z]{5}\.tmp$/);
          done();
        });
      });

      it('should created file of template name', function(done) {
        mktemp.createFile('template.txt', function(err, path) {
          expect(path).to.be('template.txt');
          done();
        });
      });

    });

    describe('case in error', function() {

      beforeEach(function() {
        // callback's err is always null
        sinon.stub(fs, 'close').callsArgWith(1, null);
      });

      afterEach(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should repeated if error is EEXIST', function(done) {
        var stub = sinon.stub(),
            spy;

        stub
            .onCall(0).returns({
              code: 'EEXIST'
            })
            .onCall(1).returns({
              code: 'EEXIST'
            })
            .onCall(2).returns(null);

        sinon.stub(fs, 'open', function(path, flags, mode, callback) {
          callback(stub(), null);
        });

        spy = sinon.spy(function(err, path) {
          expect(spy.calledOnce).to.be.ok();
          expect(stub.calledThrice).to.be.ok();
          expect(err).to.be(null);
          expect(path).to.match(/^[\da-zA-Z]{3}\.tmp$/);
          done();
        });

        mktemp.createFile('XXX.tmp', spy);
      });

      it('should passed error to callback', function(done) {
        // EACCES err
        sinon.stub(fs, 'open').callsArgWith(3, {
          code: 'EACCES'
        });

        mktemp.createFile('XXX.tmp', function(err, path) {
          expect(err).to.eql({
            code: 'EACCES'
          });
          expect(path).to.be(null);
          done();
        });
      });

    });

  });

  describe('#createFileSync()', function() {

    describe('case in success', function() {

      before(function() {
        sinon.stub(fs, 'openSync').returns(100);
        sinon.stub(fs, 'closeSync');
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should created file of random name', function() {
        expect(mktemp.createFileSync('XXX')).to.match(/^[\da-zA-Z]{3}$/);
      });

      it('should created file of template name', function() {
        expect(mktemp.createFileSync('template.txt')).to.be('template.txt');
      });

    });

    describe('case in error', function() {

      beforeEach(function() {
        sinon.stub(fs, 'closeSync');
      });

      afterEach(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should repeated if error is EEXIST', function() {
        var stub = sinon.stub(),
            result;

        stub
            .onCall(0).throws({
              code: 'EEXIST'
            })
            .onCall(1).throws({
              code: 'EEXIST'
            })
            .onCall(2).returns(100);

        sinon.stub(fs, 'openSync', function(path, flags, mode) {
          return stub();
        });

        result = mktemp.createFileSync('XXX.tmp');

        expect(stub.calledThrice).to.be.ok();
        expect(result).to.match(/^[\da-zA-Z]{3}\.tmp$/);
      });

      it('should threw error', function() {
        sinon.stub(fs, 'openSync').throws({
          code: 'EACCES'
        });

        expect(function() {
          mktemp.createFileSync('');
        }).to.throwError(function(e) {
          expect(e).to.eql({
            code: 'EACCES'
          });
        });
      });

    });

  });

  describe('#createDir()', function() {

    describe('case in success', function() {

      before(function() {
        // callback's err is always null
        sinon.stub(fs, 'mkdir').callsArgWith(2, null);
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should created dir of random name', function(done) {
        mktemp.createDir('XXXXX', function(err, path) {
          expect(path).to.match(/^[\da-zA-Z]{5}$/);
          done();
        });
      });

      it('should created dir of template name', function(done) {
        mktemp.createDir('template', function(err, path) {
          expect(path).to.be('template');
          done();
        });
      });

    });

    describe('case in error', function() {

      afterEach(function() {
        fs.mkdir.restore();
      });

      it('should repeated if error is EEXIST', function(done) {
        var stub = sinon.stub(),
            spy;

        stub
            .onCall(0).returns({
              code: 'EEXIST'
            })
            .onCall(1).returns({
              code: 'EEXIST'
            })
            .onCall(2).returns(null);

        sinon.stub(fs, 'mkdir', function(path, mode, callback) {
          callback(stub(), null);
        });

        spy = sinon.spy(function(err, path) {
          expect(spy.calledOnce).to.be.ok();
          expect(stub.calledThrice).to.be.ok();
          expect(err).to.be(null);
          expect(path).to.match(/^[\da-zA-Z]{3}\.tmp$/);
          done();
        });

        mktemp.createDir('XXX.tmp', spy);
      });

      it('should passed error to callback', function(done) {
        // EACCES err
        sinon.stub(fs, 'mkdir').callsArgWith(2, {
          code: 'EACCES'
        });

        mktemp.createDir('XXX.tmp', function(err, path) {
          expect(err).to.eql({
            code: 'EACCES'
          });
          expect(path).to.be(null);
          done();
        });
      });

    });

  });

  describe('#createDirSync()', function() {

    describe('case in success', function() {

      before(function() {
        sinon.stub(fs, 'mkdirSync');
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should created dir of random name', function() {
        expect(mktemp.createDirSync('XXX')).to.match(/^[\da-zA-Z]{3}$/);
      });

      it('should created dir of template name', function() {
        expect(mktemp.createDirSync('template')).to.be('template');
      });

    });

    describe('case in error', function() {

      afterEach(function() {
        fs.mkdirSync.restore();
      });

      it('should repeated if error is EEXIST', function() {
        var stub = sinon.stub(),
            result;

        stub
            .onCall(0).throws({
              code: 'EEXIST'
            })
            .onCall(1).throws({
              code: 'EEXIST'
            })
            .onCall(2).returns(100);

        sinon.stub(fs, 'mkdirSync', function(path, mode) {
          return stub();
        });

        result = mktemp.createDirSync('XXX.tmp');

        expect(stub.calledThrice).to.be.ok();
        expect(result).to.match(/^[\da-zA-Z]{3}\.tmp$/);
      });

      it('should threw error', function() {
        sinon.stub(fs, 'mkdirSync').throws({
          code: 'EACCES'
        });

        expect(function() {
          mktemp.createDirSync('');
        }).to.throwError(function(e) {
          expect(e).to.eql({
            code: 'EACCES'
          });
        });
      });

    });

  });

});
