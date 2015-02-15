var fs = require('fs'),
    assert = require('power-assert'),
    sinon = require('sinon'),
    mktemp = require('../lib/mktemp');

describe('mktemp', function() {

  var isPromise = (typeof Promise === 'function');

  describe('.createFile()', function() {

    describe('case in success', function() {

      before(function() {
        // always pass with null
        sinon.stub(fs, 'open').callsArgWith(3, null);
        sinon.stub(fs, 'close').callsArgWith(1, null);
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should created file of random name', function(done) {
        mktemp.createFile('XXXXX.tmp', function(err, path) {
          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
          done();
        });
      });

      if (isPromise) {
        it('should created file of random name, use Promise', function() {
          return mktemp.createFile('XXXXX.tmp').then(function(path) {
            assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
          });
        });
      } else {
        it('should created file of random name, use Promise');
      }

    });

    describe('case in fail', function() {

      before(function() {
        // always pass with error
        sinon.stub(fs, 'open').callsArgWith(3, { code: 'EACCES' });
        sinon.stub(fs, 'close').callsArgWith(1, null);
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should passed error', function(done) {
        mktemp.createFile('XXX.tmp', function(err, path) {
          assert(err.code === 'EACCES');
          assert(path === null);
          done();
        });
      });

      if (isPromise) {
        it('should passed error to Promise', function() {
          return mktemp.createFile('XXX.tmp')['catch'](function(err) {
            assert(err.code === 'EACCES');
          });
        });
      } else {
        it('should passed error to Promise');
      }

    });

    describe('when duplicate path', function() {

      var stub;

      before(function() {
        // pass with error sometimes
        stub = sinon.stub();
        stub
          .onCall(0).returns({ code: 'EEXIST' })
          .onCall(1).returns({ code: 'EEXIST' })
          .onCall(2).returns(null);

        sinon.stub(fs, 'open', function(path, flags, mode, callback) {
          callback(stub(), null);
        });
        sinon.stub(fs, 'close').callsArgWith(1, null);
      });

      after(function() {
        fs.open.restore();
        fs.close.restore();
      });

      it('should created file of random name', function(done) {
        var spy = sinon.spy(function(err, path) {
          assert(stub.calledThrice === true);
          assert(spy.calledOnce === true);
          assert(err === null);
          assert(/^[\da-zA-Z]{3}\.tmp$/.test(path));
          done();
        });

        mktemp.createFile('XXX.tmp', spy);
      });

    });

    describe('when unsupported Promise', function() {

      if (isPromise) {
        it('should threw error');
      } else {
        it('should threw error', function() {
          assert.throws(function() {
            mktemp.createFile('');
          }, TypeError);
        });
      }

    });

  });

  describe('.createFileSync()', function() {

    describe('case in success', function() {

      before(function() {
        // always return fd
        sinon.stub(fs, 'openSync').returns(100);
        sinon.stub(fs, 'closeSync');
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should created file of random name', function() {
        assert(/^[\da-zA-Z]{3}$/.test(mktemp.createFileSync('XXX')));
      });

    });

    describe('case in fail', function() {

      before(function() {
        // always throws error
        sinon.stub(fs, 'openSync').throws({ code: 'EACCES' });
        sinon.stub(fs, 'closeSync');
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should threw error', function() {
        assert.throws(function() {
          mktemp.createFileSync('');
        }, function(err) {
          return (err.code === 'EACCES');
        });
      });

    });

    describe('when duplicate path', function() {

      var stub;

      before(function() {
        // throws error sometimes
        stub = sinon.stub();
        stub
          .onCall(0).throws({ code: 'EEXIST' })
          .onCall(1).throws({ code: 'EEXIST' })
          .onCall(2).returns(100);

        sinon.stub(fs, 'openSync', function(path, flags, mode) {
          return stub();
        });
        sinon.stub(fs, 'closeSync');
      });

      after(function() {
        fs.openSync.restore();
        fs.closeSync.restore();
      });

      it('should created file of random name', function() {
        var path = mktemp.createFileSync('XXX');

        assert(stub.calledThrice === true);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });

    });

  });

  describe('.createDir()', function() {

    describe('case in success', function() {

      before(function() {
        // always pass with null
        sinon.stub(fs, 'mkdir').callsArgWith(2, null);
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should created dir of random name', function(done) {
        mktemp.createDir('XXXXX', function(err, path) {
          assert(/^[\da-zA-Z]{5}$/.test(path));
          done();
        });
      });

      if (isPromise) {
        it('should created dir of random name, use Promise', function() {
          return mktemp.createDir('XXXXX').then(function(path) {
            assert(/^[\da-zA-Z]{5}$/.test(path));
          });
        });
      } else {
        it('should created dir of random name, use Promise');
      }

    });

    describe('case in fail', function() {

      before(function() {
        // always pass with error
        sinon.stub(fs, 'mkdir').callsArgWith(2, { code: 'EACCES' });
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should passed error', function(done) {
        mktemp.createDir('XXX', function(err, path) {
          assert(err.code === 'EACCES');
          assert(path === null);
          done();
        });
      });

      if (isPromise) {
        it('should passed error to Promise', function() {
          return mktemp.createDir('XXX')['catch'](function(err) {
            assert(err.code === 'EACCES');
          });
        });
      } else {
        it('should passed error to Promise');
      }

    });

    describe('when duplicate path', function() {

      var stub;

      before(function() {
        // pass with error sometimes
        stub = sinon.stub();
        stub
          .onCall(0).returns({ code: 'EEXIST' })
          .onCall(1).returns({ code: 'EEXIST' })
          .onCall(2).returns(null);

        sinon.stub(fs, 'mkdir', function(path, mode, callback) {
          callback(stub(), null);
        });
      });

      after(function() {
        fs.mkdir.restore();
      });

      it('should created dir of random name', function(done) {
        var spy = sinon.spy(function(err, path) {
          assert(stub.calledThrice === true);
          assert(spy.calledOnce === true);
          assert(err === null);
          assert(/^[\da-zA-Z]{3}$/.test(path));
          done();
        });

        mktemp.createDir('XXX', spy);
      });

    });

    describe('when unsupported Promise', function() {

      if (isPromise) {
        it('should threw error');
      } else {
        it('should threw error', function() {
          assert.throws(function() {
            mktemp.createFile('');
          }, TypeError);
        });
      }

    });
  });

  describe('.createDirSync()', function() {

    describe('case in success', function() {

      before(function() {
        // basic stub
        sinon.stub(fs, 'mkdirSync');
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should created dir of random name', function() {
        assert(/^[\da-zA-Z]{3}$/.test(mktemp.createDirSync('XXX')));
      });

    });

    describe('case in fail', function() {

      before(function() {
        // always throws error
        sinon.stub(fs, 'mkdirSync').throws({ code: 'EACCES' });
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should threw error', function() {
        assert.throws(function() {
          mktemp.createDirSync('');
        }, function(err) {
          return (err.code === 'EACCES');
        });
      });

    });

    describe('when duplicate path', function() {

      var stub;

      before(function() {
        // throws error sometimes
        stub = sinon.stub();
        stub
          .onCall(0).throws({ code: 'EEXIST' })
          .onCall(1).throws({ code: 'EEXIST' })
          .onCall(2).returns(100);

        sinon.stub(fs, 'mkdirSync', function(path, mode) {
          return stub();
        });
      });

      after(function() {
        fs.mkdirSync.restore();
      });

      it('should created dir of random name', function() {
        var path = mktemp.createDirSync('XXX');

        assert(stub.calledThrice === true);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });

    });

  });

});
