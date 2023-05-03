import assert = require('assert');
import * as fs from 'fs';

import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import * as sinon from 'sinon';

import * as mktemp from '../';

describe('mktemp', function () {
  const isPromise = typeof Promise === 'function';

  describe('.createFile()', function () {
    describe('case in success', function () {
      let fsOpenStub: sinon.SinonStub;
      let fsCloseStub: sinon.SinonStub;

      before(function () {
        // always pass with null
        fsOpenStub = sinon.stub(fs, 'open');
        fsOpenStub.callsArgWith(3, null);
        fsCloseStub = sinon.stub(fs, 'close');
        fsCloseStub.callsArgWith(1, null);
      });

      after(function () {
        fsOpenStub.restore();
        fsCloseStub.restore();
      });

      it('should created file of random name', function (done) {
        mktemp.createFile('XXXXX.tmp', function (err, path) {
          if (path === null) {
            assert.fail();
            done(new Error());

            return;
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
          done();
        });
      });

      if (isPromise) {
        it('should created file of random name, use Promise', function () {
          return mktemp.createFile('XXXXX.tmp')!.then(function (path) {
            if (path === null) {
              assert.fail();

              return;
            }

            assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
          });
        });
      } else {
        it('should created file of random name, use Promise');
      }
    });

    describe('case in fail', function () {
      let fsOpenStub: sinon.SinonStub;
      let fsCloseStub: sinon.SinonStub;

      before(function () {
        // always pass with error
        fsOpenStub = sinon.stub(fs, 'open');
        fsOpenStub.callsArgWith(3, { code: 'EACCES' });
        fsCloseStub = sinon.stub(fs, 'close');
        fsCloseStub.callsArgWith(1, null);
      });

      after(function () {
        fsOpenStub.restore();
        fsCloseStub.restore();
      });

      it('should passed error', function (done) {
        mktemp.createFile('XXX.tmp', function (err, path) {
          assert(err!.code === 'EACCES');
          assert(path === null);
          done();
        });
      });

      if (isPromise) {
        it('should passed error to Promise', function () {
          return mktemp.createFile('XXX.tmp')!['catch'](function (err) {
            assert(err.code === 'EACCES');
          });
        });
      } else {
        it('should passed error to Promise');
      }
    });

    describe('when duplicate path', function () {
      let stub: sinon.SinonStub;
      let fsOpenStub: sinon.SinonStub;
      let fsCloseStub: sinon.SinonStub;

      before(function () {
        // pass with error sometimes
        stub = sinon.stub();
        stub
          .onCall(0)
          .returns({ code: 'EEXIST' })
          .onCall(1)
          .returns({ code: 'EEXIST' })
          .onCall(2)
          .returns(null);

        fsOpenStub = sinon.stub(fs, 'open');
        fsOpenStub.callsFake(function (path, flags, mode, callback) {
          callback(stub(), null);
        });
        fsCloseStub = sinon.stub(fs, 'close');
        fsCloseStub.callsArgWith(1, null);
      });

      after(function () {
        fsOpenStub.restore();
        fsCloseStub.restore();
      });

      it('should created file of random name', function (done) {
        var spy = sinon.spy(function (err, path) {
          assert(stub.calledThrice === true);
          assert(spy.calledOnce === true);
          assert(err === null);
          assert(/^[\da-zA-Z]{3}\.tmp$/.test(path));
          done();
        });

        mktemp.createFile('XXX.tmp', spy);
      });
    });

    describe('when no files are available', function () {
      let fsOpenStub: sinon.SinonStub;

      beforeEach(function () {
        fsOpenStub = sinon.stub(fs, 'open');
        fsOpenStub.callsArgWith(3, { code: 'EEXIST' });
      });

      afterEach(function () {
        fsOpenStub.restore();
      });

      it('throws an error', function (done) {
        mktemp.createFile('temp-X', function (err) {
          assert(err!.code === 'EEXIST');
          done();
        });
      });
    });

    describe('when unsupported Promise', function () {
      if (isPromise) {
        it('should threw error');
      } else {
        it('should threw error', function () {
          assert.throws(function () {
            mktemp.createFile('');
          }, TypeError);
        });
      }
    });
  });

  describe('.createFileSync()', function () {
    describe('case in success', function () {
      let fsOpenSyncStub: sinon.SinonStub;
      let fsCloseSyncStub: sinon.SinonStub;

      before(function () {
        // always return fd
        fsOpenSyncStub = sinon.stub(fs, 'openSync');
        fsOpenSyncStub.returns(100);
        fsCloseSyncStub = sinon.stub(fs, 'closeSync');
      });

      after(function () {
        fsOpenSyncStub.restore();
        fsCloseSyncStub.restore();
      });

      it('should created file of random name', function () {
        assert(/^[\da-zA-Z]{3}$/.test(mktemp.createFileSync('XXX')));
      });
    });

    describe('case in fail', function () {
      let fsOpenSyncStub: sinon.SinonStub;
      let fsCloseSyncStub: sinon.SinonStub;

      before(function () {
        // always throws error
        fsOpenSyncStub = sinon.stub(fs, 'openSync');
        fsOpenSyncStub.throws({ code: 'EACCES' });
        fsCloseSyncStub = sinon.stub(fs, 'closeSync');
      });

      after(function () {
        fsOpenSyncStub.restore();
        fsCloseSyncStub.restore();
      });

      it('should threw error', function () {
        assert.throws(
          function () {
            mktemp.createFileSync('');
          },
          function (err: any) {
            return err.code === 'EACCES';
          }
        );
      });
    });

    describe('when no files are available', function () {
      let fsOpenSyncStub: sinon.SinonStub;

      before(function () {
        fsOpenSyncStub = sinon.stub(fs, 'openSync');
        fsOpenSyncStub.throws({ code: 'EEXIST' });
      });

      after(function () {
        fsOpenSyncStub.restore();
      });

      it('throws an error', function () {
        assert.throws(function () {
          try {
            mktemp.createFileSync('foo-X');
          } catch (e) {
            assert('EEXIST' === e.code);
            throw e;
          }
        });
      });
    });

    describe('when duplicate path', function () {
      let stub: sinon.SinonStub;
      let fsOpenSyncStub: sinon.SinonStub;
      let fsCloseSyncStub: sinon.SinonStub;

      before(function () {
        // throws error sometimes
        stub = sinon.stub();
        stub
          .onCall(0)
          .throws({ code: 'EEXIST' })
          .onCall(1)
          .throws({ code: 'EEXIST' })
          .onCall(2)
          .returns(100);

        fsOpenSyncStub = sinon.stub(fs, 'openSync');
        fsOpenSyncStub.callsFake(function () {
          return stub();
        });
        fsCloseSyncStub = sinon.stub(fs, 'closeSync');
      });

      after(function () {
        fsOpenSyncStub.restore();
        fsCloseSyncStub.restore();
      });

      it('should created file of random name', function () {
        var path = mktemp.createFileSync('XXX');

        assert(stub.calledThrice === true);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });
    });
  });

  describe('.createDir()', function () {
    describe('case in success', function () {
      let fsMkdirStub: sinon.SinonStub;

      before(function () {
        // always pass with null
        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsArgWith(2, null);
      });

      after(function () {
        fsMkdirStub.restore();
      });

      it('should created dir of random name', function (done) {
        mktemp.createDir('XXXXX', function (err, path) {
          if (path === null) {
            assert.fail();
            done(new Error());

            return;
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));
          done();
        });
      });

      if (isPromise) {
        it('should created dir of random name, use Promise', function () {
          return mktemp.createDir('XXXXX')!.then(function (path) {
            if (path === null) {
              assert.fail();

              return;
            }

            assert(/^[\da-zA-Z]{5}$/.test(path));
          });
        });
      } else {
        it('should created dir of random name, use Promise');
      }
    });

    describe('case in fail', function () {
      let fsMkdirStub: sinon.SinonStub;

      before(function () {
        // always pass with error
        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsArgWith(2, { code: 'EACCES' });
      });

      after(function () {
        fsMkdirStub.restore();
      });

      it('should passed error', function (done) {
        mktemp.createDir('XXX', function (err, path) {
          assert(err!.code === 'EACCES');
          assert(path === null);
          done();
        });
      });

      if (isPromise) {
        it('should passed error to Promise', function () {
          return mktemp.createDir('XXX')!['catch'](function (err) {
            assert(err.code === 'EACCES');
          });
        });
      } else {
        it('should passed error to Promise');
      }
    });

    describe('when duplicate path', function () {
      let stub: sinon.SinonStub;
      let fsMkdirStub: sinon.SinonStub;

      before(function () {
        // pass with error sometimes
        stub = sinon.stub();
        stub
          .onCall(0)
          .returns({ code: 'EEXIST' })
          .onCall(1)
          .returns({ code: 'EEXIST' })
          .onCall(2)
          .returns(null);

        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsFake(function (path, mode, callback) {
          callback(stub(), null);
        });
      });

      after(function () {
        fsMkdirStub.restore();
      });

      it('should created dir of random name', function (done) {
        var spy = sinon.spy(function (err, path) {
          assert(stub.calledThrice === true);
          assert(spy.calledOnce === true);
          assert(err === null);
          assert(/^[\da-zA-Z]{3}$/.test(path));
          done();
        });

        mktemp.createDir('XXX', spy);
      });
    });

    describe('when no files are available', function () {
      let fsMkdirStub: sinon.SinonStub;

      beforeEach(function () {
        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsArgWith(2, { code: 'EEXIST' });
      });

      afterEach(function () {
        fsMkdirStub.restore();
      });

      it('throws an error', function (done) {
        mktemp.createDir('temp-X', function (err) {
          assert(err!.code === 'EEXIST');
          done();
        });
      });
    });

    describe('when unsupported Promise', function () {
      if (isPromise) {
        it('should threw error');
      } else {
        it('should threw error', function () {
          assert.throws(function () {
            mktemp.createFile('');
          }, TypeError);
        });
      }
    });
  });

  describe('.createDirSync()', function () {
    let fsMkdirSyncStub: sinon.SinonStub;

    describe('case in success', function () {
      before(function () {
        // basic stub
        fsMkdirSyncStub = sinon.stub(fs, 'mkdirSync');
      });

      after(function () {
        fsMkdirSyncStub.restore();
      });

      it('should created dir of random name', function () {
        assert(/^[\da-zA-Z]{3}$/.test(mktemp.createDirSync('XXX')));
      });
    });

    describe('case in fail', function () {
      let fsMkdirSyncStub: sinon.SinonStub;

      before(function () {
        // always throws error
        fsMkdirSyncStub = sinon.stub(fs, 'mkdirSync');
        fsMkdirSyncStub.throws({ code: 'EACCES' });
      });

      after(function () {
        fsMkdirSyncStub.restore();
      });

      it('should threw error', function () {
        assert.throws(
          function () {
            mktemp.createDirSync('');
          },
          function (err: any) {
            return err.code === 'EACCES';
          }
        );
      });
    });

    describe('when duplicate path', function () {
      let stub: sinon.SinonStub;
      let fsMkdirSyncStub: sinon.SinonStub;

      before(function () {
        // throws error sometimes
        stub = sinon.stub();
        stub
          .onCall(0)
          .throws({ code: 'EEXIST' })
          .onCall(1)
          .throws({ code: 'EEXIST' })
          .onCall(2)
          .returns(100);

        fsMkdirSyncStub = sinon.stub(fs, 'mkdirSync');
        fsMkdirSyncStub.callsFake(function () {
          return stub();
        });
      });

      after(function () {
        fsMkdirSyncStub.restore();
      });

      it('should created dir of random name', function () {
        var path = mktemp.createDirSync('XXX');

        assert(stub.calledThrice === true);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });
    });

    describe('when no files are available', function () {
      let fsMkdirSyncStub: sinon.SinonStub;

      before(function () {
        fsMkdirSyncStub = sinon.stub(fs, 'mkdirSync');
        fsMkdirSyncStub.throws({ code: 'EEXIST' });
      });

      after(function () {
        fsMkdirSyncStub.restore();
      });

      it('throws an error', function () {
        assert.throws(function () {
          try {
            mktemp.createDirSync('foo');
          } catch (e) {
            assert('EEXIST' === e.code);
            throw e;
          }
        });
      });
    });
  });
});
