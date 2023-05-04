import assert from 'assert';
import fs from 'fs';

import * as sinon from 'sinon';

import {
  createFile
  // createFileSync,
  // createDir,
  // createDirSync
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

      it('throws an error', function (done) {
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
  // describe('createFileSync()', function () {});
  // describe('createDir()', function () {});
  // describe('createDirSync()', function () {});
});
