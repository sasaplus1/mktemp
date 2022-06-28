import assert = require('assert');

import fs from 'fs';

import * as sinon from 'sinon';

import {
  createFile,
  createFileSync,
  createDir,
  createDirSync
} from './creation';

describe('creation', function () {
  const hasPromise = typeof Promise === 'function';

  describe('createFile()', function () {
    describe('success cases', function () {
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

      it('should create unique name file', function (done) {
        createFile('XXXXX.tmp', function (err, path): void {
          if (err || path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));

          done();
        });
      });

      it('should create unique name file with mode', function (done) {
        createFile('XXXXX.tmp', 384, function (err, path): void {
          if (err || path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));

          done();
        });
      });

      it('should create unique name file, Promise version', function () {
        if (!hasPromise) {
          return this.skip();
        }

        return createFile('XXXXX.tmp').then(function (path): void {
          if (path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
        });
      });

      it('should create unique name file with mode, Promise version', function () {
        if (!hasPromise) {
          return this.skip();
        }

        return createFile('XXXXX.tmp', 384).then(function (path): void {
          if (path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
        });
      });
    });

    describe('fail cases', function () {
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

      it('should pass error', function (done) {
        createFile('XXX.tmp', function (err, path): void {
          if (!err) {
            return assert.fail();
          }

          assert(err.code === 'EACCES');
          assert(path === null);

          done();
        });
      });

      it('should pass error, Promise version', function () {
        if (!hasPromise) {
          return this.skip();
        }

        return createFile('XXX.tmp')['catch'](function (err) {
          assert(err.code === 'EACCES');
        });
      });
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
        fsOpenStub.callsFake(function (_path, _flags, _mode, callback) {
          callback(stub(), null);
        });
        fsCloseStub = sinon.stub(fs, 'close');
        fsCloseStub.callsArgWith(1, null);
      });

      after(function () {
        fsOpenStub.restore();
        fsCloseStub.restore();
      });

      it('should create unique name file', function (done) {
        const spy = sinon.spy(function (err, path) {
          assert(stub.calledThrice === true);
          assert(spy.calledOnce === true);
          assert(err === null);
          assert(/^[\da-zA-Z]{3}\.tmp$/.test(path));

          done();
        });

        createFile('XXX.tmp', spy);
      });
    });

    describe('when available files not found', function () {
      let fsOpenStub: sinon.SinonStub;

      before(function () {
        fsOpenStub = sinon.stub(fs, 'open');
        fsOpenStub.callsArgWith(3, { code: 'EEXIST' });
      });

      after(function () {
        fsOpenStub.restore();
      });

      it('should throws an error', function (done) {
        createFile('temp-X', function (err): void {
          if (!err) {
            return assert.fail();
          }

          assert(err instanceof RangeError);
          assert(err.message === 'over max retry count');

          done();
        });
      });
    });
  });

  describe('createFileSync()', function () {
    describe('success cases', function () {
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

      it('should create unique name file', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createFileSync('XXX')));
      });

      it('should create unique name file with mode', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createFileSync('XXX', 384)));
      });
    });

    describe('fail cases', function () {
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

      it('should throws an error', function () {
        assert.throws(
          function () {
            createFileSync('');
          },
          function (err) {
            assert((err as NodeJS.ErrnoException).code === 'EACCES');

            return true;
          }
        );
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

      it('should create unique name file', function () {
        const path = createFileSync('XXX');

        assert(stub.calledThrice === true);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });
    });

    describe('when available files not found', function () {
      let fsOpenSyncStub: sinon.SinonStub;

      before(function () {
        fsOpenSyncStub = sinon.stub(fs, 'openSync');
        fsOpenSyncStub.throws({ code: 'EEXIST' });
      });

      after(function () {
        fsOpenSyncStub.restore();
      });

      it('should throws an error', function () {
        assert.throws(
          function () {
            createFileSync('temp-X');
          },
          function (err) {
            assert(err instanceof RangeError);
            assert(err.message === 'over max retry count');

            return true;
          }
        );
      });
    });
  });
  describe('createDir()', function () {
    describe('success cases', function () {
      let fsMkdirStub: sinon.SinonStub;

      before(function () {
        // always pass with null
        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsArgWith(2, null);
      });

      after(function () {
        fsMkdirStub.restore();
      });

      it('should create unique name directory', function (done) {
        createDir('XXXXX', function (err, path): void {
          if (err || path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));

          done();
        });
      });

      it('should create unique name directory with mode', function (done) {
        createDir('XXXXX', 448, function (err, path): void {
          if (err || path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));

          done();
        });
      });

      it('should create unique name dir, Promise version', function () {
        if (!hasPromise) {
          return this.skip();
        }

        return createDir('XXXXX').then(function (path): void {
          if (path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));
        });
      });

      it('should create unique name dir with mode, Promise version', function () {
        if (!hasPromise) {
          return this.skip();
        }

        return createDir('XXXXX', 448).then(function (path): void {
          if (path === null) {
            return assert.fail();
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));
        });
      });
    });

    describe('fail cases', function () {
      let fsMkdirStub: sinon.SinonStub;

      before(function () {
        // always pass with error
        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsArgWith(2, { code: 'EACCES' });
      });

      after(function () {
        fsMkdirStub.restore();
      });

      it('should pass error', function (done) {
        createDir('XXX', function (err, path): void {
          if (!err) {
            return assert.fail();
          }

          assert(err.code === 'EACCES');
          assert(path === null);

          done();
        });
      });

      it('should pass error, Promise version', function () {
        if (!hasPromise) {
          return this.skip();
        }

        return createDir('XXX')['catch'](function (err) {
          assert(err.code === 'EACCES');
        });
      });
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
        fsMkdirStub.callsFake(function (_path, _mode, callback) {
          callback(stub(), null);
        });
      });

      after(function () {
        fsMkdirStub.restore();
      });

      it('should create unique name directory', function (done) {
        const spy = sinon.spy(function (err, path) {
          assert(stub.calledThrice === true);
          assert(spy.calledOnce === true);
          assert(err === null);
          assert(/^[\da-zA-Z]{3}$/.test(path));

          done();
        });

        createDir('XXX', spy);
      });
    });

    describe('when available files not found', function () {
      let fsMkdirStub: sinon.SinonStub;

      beforeEach(function () {
        fsMkdirStub = sinon.stub(fs, 'mkdir');
        fsMkdirStub.callsArgWith(2, { code: 'EEXIST' });
      });

      afterEach(function () {
        fsMkdirStub.restore();
      });

      it('should throws an error', function (done) {
        createDir('temp-X', function (err): void {
          if (!err) {
            return assert.fail();
          }

          assert(err instanceof RangeError);
          assert(err.message === 'over max retry count');

          done();
        });
      });
    });
  });
  describe('createDirSync()', function () {
    let fsMkdirSyncStub: sinon.SinonStub;

    describe('success cases', function () {
      before(function () {
        // basic stub
        fsMkdirSyncStub = sinon.stub(fs, 'mkdirSync');
      });

      after(function () {
        fsMkdirSyncStub.restore();
      });

      it('should create unique name dir', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createDirSync('XXX')));
      });

      it('should create unique name dir with mode', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createDirSync('XXX', 448)));
      });
    });

    describe('fail cases', function () {
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
            createDirSync('');
          },
          function (err) {
            assert((err as NodeJS.ErrnoException).code === 'EACCES');

            return true;
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

      it('should create unique name dir', function () {
        const path = createDirSync('XXX');

        assert(stub.calledThrice === true);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });
    });

    describe('when available files not found', function () {
      let fsMkdirSyncStub: sinon.SinonStub;

      before(function () {
        fsMkdirSyncStub = sinon.stub(fs, 'mkdirSync');
        fsMkdirSyncStub.throws({ code: 'EEXIST' });
      });

      after(function () {
        fsMkdirSyncStub.restore();
      });

      it('should throws an error', function () {
        assert.throws(
          function () {
            createDirSync('');
          },
          function (err) {
            assert(err instanceof RangeError);
            assert(err.message === 'over max retry count');

            return true;
          }
        );
      });
    });
  });
});
