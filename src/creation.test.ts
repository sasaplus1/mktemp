import { describe, it, beforeAll, afterAll, beforeEach, afterEach, assert, vi } from 'vitest';
import fs from 'node:fs';

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
      let fsOpenSpy: any;
      let fsCloseSpy: any;

      beforeAll(function () {
        // always pass with null
        fsOpenSpy = vi.spyOn(fs, 'open').mockImplementation((_path: any, _flags: any, _mode: any, callback: any) => {
          callback(null);
        });
        fsCloseSpy = vi.spyOn(fs, 'close').mockImplementation((_fd: any, callback: any) => { 
          callback(null);
        });
      });

      afterAll(function () {
        fsOpenSpy.mockRestore();
        fsCloseSpy.mockRestore();
      });

      it('should create unique name file', function () {
        return new Promise((resolve, reject) => {
          createFile('XXXXX.tmp', function (err, path): void {
            if (err || path === null) {
              return reject(new Error('Expected success but got error or null'));
            }

            assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
            resolve(undefined);
          });
        });
      });

      it('should create unique name file with mode', function () {
        return new Promise((resolve, reject) => {
          createFile('XXXXX.tmp', 384, function (err, path): void {
            if (err || path === null) {
              return reject(new Error('Expected success but got error or null'));
            }

            assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
            resolve(undefined);
          });
        });
      });

      it.skipIf(!hasPromise)('should create unique name file, Promise version', function () {
        return createFile('XXXXX.tmp').then(function (path): void {
          if (path === null) {
            throw new Error('Expected path but got null');
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
        });
      });

      it.skipIf(!hasPromise)('should create unique name file with mode, Promise version', function () {
        return createFile('XXXXX.tmp', 384).then(function (path): void {
          if (path === null) {
            throw new Error('Expected path but got null');
          }

          assert(/^[\da-zA-Z]{5}\.tmp$/.test(path));
        });
      });
    });

    describe('fail cases', function () {
      let fsOpenSpy: any;
      let fsCloseSpy: any;

      beforeAll(function () {
        // always pass with error
        fsOpenSpy = vi.spyOn(fs, 'open').mockImplementation((_path, _flags, _mode, callback) => {
          callback({ code: 'EACCES' });
        });
        fsCloseSpy = vi.spyOn(fs, 'close').mockImplementation((_fd, callback) => {
          callback(null);
        });
      });

      afterAll(function () {
        fsOpenSpy.mockRestore();
        fsCloseSpy.mockRestore();
      });

      it('should pass error', function () {
        return new Promise((resolve, reject) => {
          createFile('XXX.tmp', function (err, path): void {
            if (!err) {
              return reject(new Error('Expected error but got none'));
            }

            assert(err.code === 'EACCES');
            assert(path === null);
            resolve(undefined);
          });
        });
      });

      it.skipIf(!hasPromise)('should pass error, Promise version', function () {
        return createFile('XXX.tmp')['catch'](function (err) {
          assert(err.code === 'EACCES');
        });
      });
    });

    describe('when duplicate path', function () {
      let mockFn: any;
      let fsOpenSpy: any;
      let fsCloseSpy: any;

      beforeAll(function () {
        // pass with error sometimes
        mockFn = vi.fn()
          .mockReturnValueOnce({ code: 'EEXIST' })
          .mockReturnValueOnce({ code: 'EEXIST' })
          .mockReturnValueOnce(null);

        fsOpenSpy = vi.spyOn(fs, 'open').mockImplementation((_path, _flags, _mode, callback) => {
          callback(mockFn(), null);
        });
        fsCloseSpy = vi.spyOn(fs, 'close').mockImplementation((_fd, callback) => {
          callback(null);
        });
      });

      afterAll(function () {
        fsOpenSpy.mockRestore();
        fsCloseSpy.mockRestore();
      });

      it('should create unique name file', function () {
        return new Promise((resolve) => {
          const callbackSpy = vi.fn((err, path) => {
            assert(mockFn.mock.calls.length === 3);
            assert(callbackSpy.mock.calls.length === 1);
            assert(err === null);
            assert(/^[\da-zA-Z]{3}\.tmp$/.test(path));
            resolve(undefined);
          });

          createFile('XXX.tmp', callbackSpy);
        });
      });
    });

    describe('when available files not found', function () {
      let fsOpenSpy: any;

      beforeAll(function () {
        fsOpenSpy = vi.spyOn(fs, 'open').mockImplementation((_path, _flags, _mode, callback) => {
          callback({ code: 'EEXIST' });
        });
      });

      afterAll(function () {
        fsOpenSpy.mockRestore();
      });

      it('should throws an error', function () {
        return new Promise((resolve, reject) => {
          createFile('temp-X', function (err): void {
            if (!err) {
              return reject(new Error('Expected error but got none'));
            }

            assert(err instanceof RangeError);
            assert(err.message === 'over max retry count');
            resolve(undefined);
          });
        });
      });
    });
  });

  describe('createFileSync()', function () {
    describe('success cases', function () {
      let fsOpenSyncSpy: any;
      let fsCloseSyncSpy: any;

      beforeAll(function () {
        // always return fd
        fsOpenSyncSpy = vi.spyOn(fs, 'openSync').mockReturnValue(100);
        fsCloseSyncSpy = vi.spyOn(fs, 'closeSync').mockImplementation(() => {});
      });

      afterAll(function () {
        fsOpenSyncSpy.mockRestore();
        fsCloseSyncSpy.mockRestore();
      });

      it('should create unique name file', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createFileSync('XXX')));
      });

      it('should create unique name file with mode', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createFileSync('XXX', 384)));
      });
    });

    describe('fail cases', function () {
      let fsOpenSyncSpy: any;
      let fsCloseSyncSpy: any;

      beforeAll(function () {
        // always throws error
        fsOpenSyncSpy = vi.spyOn(fs, 'openSync').mockImplementation(() => {
          throw { code: 'EACCES' };
        });
        fsCloseSyncSpy = vi.spyOn(fs, 'closeSync').mockImplementation(() => {});
      });

      afterAll(function () {
        fsOpenSyncSpy.mockRestore();
        fsCloseSyncSpy.mockRestore();
      });

      it('should throws an error', function () {
        assert.throws(function () {
          createFileSync('');
        });
      });
    });

    describe('when duplicate path', function () {
      let mockFn: any;
      let fsOpenSyncSpy: any;
      let fsCloseSyncSpy: any;

      beforeAll(function () {
        // throws error sometimes
        mockFn = vi.fn()
          .mockImplementationOnce(() => { throw { code: 'EEXIST' }; })
          .mockImplementationOnce(() => { throw { code: 'EEXIST' }; })
          .mockReturnValueOnce(100);

        fsOpenSyncSpy = vi.spyOn(fs, 'openSync').mockImplementation(() => {
          return mockFn();
        });
        fsCloseSyncSpy = vi.spyOn(fs, 'closeSync').mockImplementation(() => {});
      });

      afterAll(function () {
        fsOpenSyncSpy.mockRestore();
        fsCloseSyncSpy.mockRestore();
      });

      it('should create unique name file', function () {
        const path = createFileSync('XXX');

        assert(mockFn.mock.calls.length === 3);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });
    });

    describe('when available files not found', function () {
      let fsOpenSyncSpy: any;

      beforeAll(function () {
        fsOpenSyncSpy = vi.spyOn(fs, 'openSync').mockImplementation(() => {
          throw { code: 'EEXIST' };
        });
      });

      afterAll(function () {
        fsOpenSyncSpy.mockRestore();
      });

      it('should throws an error', function () {
        assert.throws(
          function () {
            createFileSync('temp-X');
          },
          /over max retry count/
        );
      });
    });
  });
  describe('createDir()', function () {
    describe('success cases', function () {
      let fsMkdirSpy: any;

      beforeAll(function () {
        // always pass with null
        fsMkdirSpy = vi.spyOn(fs, 'mkdir').mockImplementation((_path, _mode, callback) => {
          callback(null);
        });
      });

      afterAll(function () {
        fsMkdirSpy.mockRestore();
      });

      it('should create unique name directory', function () {
        return new Promise((resolve, reject) => {
          createDir('XXXXX', function (err, path): void {
            if (err || path === null) {
              return reject(new Error('Expected success but got error or null'));
            }

            assert(/^[\da-zA-Z]{5}$/.test(path));
            resolve(undefined);
          });
        });
      });

      it('should create unique name directory with mode', function () {
        return new Promise((resolve, reject) => {
          createDir('XXXXX', 448, function (err, path): void {
            if (err || path === null) {
              return reject(new Error('Expected success but got error or null'));
            }

            assert(/^[\da-zA-Z]{5}$/.test(path));
            resolve(undefined);
          });
        });
      });

      it.skipIf(!hasPromise)('should create unique name dir, Promise version', function () {
        return createDir('XXXXX').then(function (path): void {
          if (path === null) {
            throw new Error('Expected path but got null');
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));
        });
      });

      it.skipIf(!hasPromise)('should create unique name dir with mode, Promise version', function () {
        return createDir('XXXXX', 448).then(function (path): void {
          if (path === null) {
            throw new Error('Expected path but got null');
          }

          assert(/^[\da-zA-Z]{5}$/.test(path));
        });
      });
    });

    describe('fail cases', function () {
      let fsMkdirSpy: any;

      beforeAll(function () {
        // always pass with error
        fsMkdirSpy = vi.spyOn(fs, 'mkdir').mockImplementation((_path, _mode, callback) => {
          callback({ code: 'EACCES' });
        });
      });

      afterAll(function () {
        fsMkdirSpy.mockRestore();
      });

      it('should pass error', function () {
        return new Promise((resolve, reject) => {
          createDir('XXX', function (err, path): void {
            if (!err) {
              return reject(new Error('Expected error but got none'));
            }

            assert(err.code === 'EACCES');
            assert(path === null);
            resolve(undefined);
          });
        });
      });

      it.skipIf(!hasPromise)('should pass error, Promise version', function () {
        return createDir('XXX')['catch'](function (err) {
          assert(err.code === 'EACCES');
        });
      });
    });

    describe('when duplicate path', function () {
      let mockFn: any;
      let fsMkdirSpy: any;

      beforeAll(function () {
        // pass with error sometimes
        mockFn = vi.fn()
          .mockReturnValueOnce({ code: 'EEXIST' })
          .mockReturnValueOnce({ code: 'EEXIST' })
          .mockReturnValueOnce(null);

        fsMkdirSpy = vi.spyOn(fs, 'mkdir').mockImplementation((_path, _mode, callback) => {
          callback(mockFn(), null);
        });
      });

      afterAll(function () {
        fsMkdirSpy.mockRestore();
      });

      it('should create unique name directory', function () {
        return new Promise((resolve) => {
          const callbackSpy = vi.fn((err, path) => {
            assert(mockFn.mock.calls.length === 3);
            assert(callbackSpy.mock.calls.length === 1);
            assert(err === null);
            assert(/^[\da-zA-Z]{3}$/.test(path));
            resolve(undefined);
          });

          createDir('XXX', callbackSpy);
        });
      });
    });

    describe('when available files not found', function () {
      let fsMkdirSpy: any;

      beforeEach(function () {
        fsMkdirSpy = vi.spyOn(fs, 'mkdir').mockImplementation((_path, _mode, callback) => {
          callback({ code: 'EEXIST' });
        });
      });

      afterEach(function () {
        fsMkdirSpy.mockRestore();
      });

      it('should throws an error', function () {
        return new Promise((resolve, reject) => {
          createDir('temp-X', function (err): void {
            if (!err) {
              return reject(new Error('Expected error but got none'));
            }

            assert(err instanceof RangeError);
            assert(err.message === 'over max retry count');
            resolve(undefined);
          });
        });
      });
    });
  });
  describe('createDirSync()', function () {
    let fsMkdirSyncSpy: any;

    describe('success cases', function () {
      beforeAll(function () {
        // basic stub
        fsMkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {});
      });

      afterAll(function () {
        fsMkdirSyncSpy.mockRestore();
      });

      it('should create unique name dir', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createDirSync('XXX')));
      });

      it('should create unique name dir with mode', function () {
        assert(/^[\da-zA-Z]{3}$/.test(createDirSync('XXX', 448)));
      });
    });

    describe('fail cases', function () {
      let fsMkdirSyncSpy: any;

      beforeAll(function () {
        // always throws error
        fsMkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {
          throw { code: 'EACCES' };
        });
      });

      afterAll(function () {
        fsMkdirSyncSpy.mockRestore();
      });

      it('should threw error', function () {
        assert.throws(function () {
          createDirSync('');
        });
      });
    });

    describe('when duplicate path', function () {
      let mockFn: any;
      let fsMkdirSyncSpy: any;

      beforeAll(function () {
        // throws error sometimes
        mockFn = vi.fn()
          .mockImplementationOnce(() => { throw { code: 'EEXIST' }; })
          .mockImplementationOnce(() => { throw { code: 'EEXIST' }; })
          .mockReturnValueOnce(100);

        fsMkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {
          return mockFn();
        });
      });

      afterAll(function () {
        fsMkdirSyncSpy.mockRestore();
      });

      it('should create unique name dir', function () {
        const path = createDirSync('XXX');

        assert(mockFn.mock.calls.length === 3);
        assert(/^[\da-zA-Z]{3}$/.test(path));
      });
    });

    describe('when available files not found', function () {
      let fsMkdirSyncSpy: any;

      beforeAll(function () {
        fsMkdirSyncSpy = vi.spyOn(fs, 'mkdirSync').mockImplementation(() => {
          throw { code: 'EEXIST' };
        });
      });

      afterAll(function () {
        fsMkdirSyncSpy.mockRestore();
      });

      it('should throws an error', function () {
        assert.throws(
          function () {
            createDirSync('');
          },
          /over max retry count/
        );
      });
    });
  });
});
