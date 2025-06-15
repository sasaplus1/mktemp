import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  afterEach,
  assert,
  beforeEach,
  describe,
  it,
  vi,
  type MockInstance
} from 'vitest';
import * as mktemp from './index';

describe('exports', function () {
  it.each([
    'createDir',
    'createDirSync',
    'createFile',
    'createFileSync',
    'generateUniqueName'
  ] as const)('should export %s', function (functionName: keyof typeof mktemp) {
    assert.strictEqual(typeof mktemp[functionName], 'function');
  });
});

describe('createXxx & createXxxSync', function () {
  describe('success cases', function () {
    let tempDir: string;

    beforeEach(async function () {
      tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'mktemp-test-success-cases-')
      );
    });

    afterEach(async function () {
      await fs.promises.rm(tempDir, { recursive: true });
    });

    it('should create file', async function () {
      const template = path.join(tempDir, 'file.tmp');
      const mode = 0o600; // 384 in decimal
      const resultPath = await mktemp.createFile(template, mode);

      assert.ok(resultPath !== null);
      assert.ok(fs.existsSync(resultPath));
      // In Linux, the actual file mode contains the system default values,
      // so check that the specified permission bits are applied
      const stat = await fs.promises.stat(resultPath);
      const actualMode = stat.mode & parseInt('777', 8);
      assert.strictEqual(actualMode, mode);
    });

    it.each([
      { defaultMode: 0o700, message: 'dir', method: 'createDir' },
      { defaultMode: 0o600, message: 'file', method: 'createFile' }
    ] as const)(
      'should create unique name $message',
      function ({ defaultMode, method }) {
        return new Promise<void>((resolve, reject) => {
          const template = path.join(tempDir, 'XXXXX.tmp');
          mktemp[method](template, function (err, resultPath): void {
            if (err || resultPath === null) {
              return reject(err);
            }

            const fileName = path.basename(resultPath);

            assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
            assert.ok(fs.existsSync(resultPath));

            // In Linux, the actual file mode contains the system default values,
            // so check that the specified permission bits are applied
            fs.stat(resultPath, function (err, stat) {
              if (err) {
                return reject(err);
              }

              const actualMode = stat.mode & parseInt('777', 8);
              assert.strictEqual(actualMode, defaultMode);
              resolve();
            });
          });
        });
      }
    );

    it.each([
      { message: 'dir', method: 'createDir', mode: 0o755 },
      { message: 'file', method: 'createFile', mode: 0o644 }
    ] as const)(
      'should create unique name $message with mode',
      function ({ mode, method }) {
        return new Promise<void>((resolve, reject) => {
          const template = path.join(tempDir, 'XXXXX.tmp');
          mktemp[method](template, mode, function (err, resultPath): void {
            if (err || resultPath === null) {
              return reject(err);
            }

            const fileName = path.basename(resultPath);

            assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
            assert.ok(fs.existsSync(resultPath));

            // In Linux, the actual file mode contains the system default values,
            // so check that the specified permission bits are applied
            fs.stat(resultPath, function (err, stat) {
              if (err) {
                return reject(err);
              }

              const actualMode = stat.mode & parseInt('777', 8);
              assert.strictEqual(actualMode, mode);
              resolve();
            });
          });
        });
      }
    );

    it.each([
      { defaultMode: 0o700, message: 'dir', method: 'createDir' },
      { defaultMode: 0o600, message: 'file', method: 'createFile' }
    ] as const)(
      'should create unique name $message, Promise version',
      async function ({ defaultMode, method }) {
        const template = path.join(tempDir, 'XXXXX.tmp');
        const resultPath = await mktemp[method](template);

        assert.ok(resultPath !== null);

        const fileName = path.basename(resultPath);

        assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
        assert.ok(fs.existsSync(resultPath));

        // In Linux, the actual file mode contains the system default values,
        // so check that the specified permission bits are applied
        const stat = await fs.promises.stat(resultPath);
        const actualMode = stat.mode & parseInt('777', 8);
        assert.strictEqual(actualMode, defaultMode);
      }
    );
    it.each([
      { message: 'dir', method: 'createDir', mode: 0o755 },
      { message: 'file', method: 'createFile', mode: 0o644 }
    ] as const)(
      'should create unique name $message with mode, Promise version',
      async function ({ mode, method }) {
        const template = path.join(tempDir, 'XXXXX.tmp');
        const resultPath = await mktemp[method](template, mode);

        assert.ok(resultPath !== null);

        const fileName = path.basename(resultPath);

        assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
        assert.ok(fs.existsSync(resultPath));

        // In Linux, the actual file mode contains the system default values,
        // so check that the specified permission bits are applied
        const stat = await fs.promises.stat(resultPath);
        const actualMode = stat.mode & parseInt('777', 8);
        assert.strictEqual(actualMode, mode);
      }
    );
    it.each([
      { defaultMode: 0o700, message: 'dir', method: 'createDirSync' },
      { defaultMode: 0o600, message: 'file', method: 'createFileSync' }
    ] as const)(
      'should create unique name $message with, sync version',
      function ({ defaultMode, method }) {
        const template = path.join(tempDir, 'XXXXX.tmp');
        const resultPath = mktemp[method](template);

        assert.ok(resultPath !== null);

        const fileName = path.basename(resultPath);

        assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
        assert.ok(fs.existsSync(resultPath));
        // In Linux, the actual file mode contains the system default values,
        // so check that the specified permission bits are applied
        const stat = fs.statSync(resultPath);
        const actualMode = stat.mode & parseInt('777', 8);
        assert.strictEqual(actualMode, defaultMode);
      }
    );

    it.each([
      { message: 'dir', method: 'createDirSync', mode: 0o755 },
      { message: 'file', method: 'createFileSync', mode: 0o644 }
    ] as const)(
      'should create unique name $message with mode, sync version',
      function ({ mode, method }) {
        const template = path.join(tempDir, 'XXXXX.tmp');
        const resultPath = mktemp[method](template, mode);

        assert.ok(resultPath !== null);

        const fileName = path.basename(resultPath);

        assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
        assert.ok(fs.existsSync(resultPath));
        // In Linux, the actual file mode contains the system default values,
        // so check that the specified permission bits are applied
        const stat = fs.statSync(resultPath);
        const actualMode = stat.mode & parseInt('777', 8);
        assert.strictEqual(actualMode, mode);
      }
    );
  });

  describe('error cases', function () {
    let tempDir: string;

    beforeEach(async function () {
      tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'mktemp-test-error-cases-')
      );
    });

    afterEach(async function () {
      await fs.promises.rm(tempDir, { recursive: true });
    });

    it('should throw error if over retry count', async function () {
      // NOTE: case-insensitive file systems reduce the number of characters that can be used
      const baseTable =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const table = baseTable.split('');
      const tableLength = table.length;
      const template = path.join(tempDir, `repeat-X.tmp`);

      for (let i = 0, len = tableLength * 5; i < len; i += 1) {
        try {
          await mktemp.createFile(template);
        } catch (err: unknown) {
          assert.ok(err instanceof RangeError);
          return;
        }
      }

      throw new Error('Expected RangeError but got none');
    });

    it.each([
      { method: 'createDirSync' },
      { method: 'createFileSync' }
    ] as const)(
      'should throw error if over retry count, $method',
      async function ({ method }) {
        // NOTE: case-insensitive file systems reduce the number of characters that can be used
        const baseTable =
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const table = baseTable.split('');
        const tableLength = table.length;
        const template = path.join(tempDir, `repeat-X.tmp`);

        for (let i = 0, len = tableLength * 5; i < len; i += 1) {
          try {
            mktemp[method](template);
          } catch (err: unknown) {
            assert.ok(err instanceof RangeError);
            return;
          }
        }

        throw new Error('Expected RangeError but got none');
      }
    );

    it('should throw error if parameter is not a string', async function () {
      try {
        await mktemp.createFile(123 as unknown as string);
      } catch (err: unknown) {
        assert.ok(err instanceof TypeError);
        return;
      }

      throw new Error('Expected TypeError but got none');
    });

    describe('need mocks', function () {
      let mockFsClose: MockInstance<typeof fs.close>;
      let mockFsMkdirSync: MockInstance<typeof fs.mkdirSync>;
      let mockFsOpen: MockInstance<typeof fs.open>;
      let mockFsOpenSync: MockInstance<typeof fs.openSync>;

      beforeEach(function () {
        mockFsClose = vi.spyOn(fs, 'close');
        mockFsMkdirSync = vi.spyOn(fs, 'mkdirSync');
        mockFsOpen = vi.spyOn(fs, 'open');
        mockFsOpenSync = vi.spyOn(fs, 'openSync');
      });

      afterEach(function () {
        vi.restoreAllMocks();
      });

      it('should throw error if error is not an EEXIST', async function () {
        mockFsOpen.mockImplementationOnce(function (
          ...args: Parameters<typeof fs.open>
        ) {
          const callback = args.find((arg) => typeof arg === 'function');
          callback?.({ code: 'EACCES' } as NodeJS.ErrnoException, 0);
        });
        mockFsClose.mockImplementationOnce(function (_fd, callback) {
          callback?.(null);
        });

        try {
          await mktemp.createFile('XXXXX.tmp');
          throw new Error('Expected error but got none');
        } catch (err) {
          assert.ok((err as NodeJS.ErrnoException).code === 'EACCES');
        }
      });

      it.each([
        { method: 'createDirSync' },
        { method: 'createFileSync' }
      ] as const)(
        'should throw error if error is not an EEXIST, $method',
        function ({ method }) {
          switch (method) {
            case 'createDirSync':
              mockFsMkdirSync.mockImplementationOnce(function () {
                throw { code: 'EACCES' } as NodeJS.ErrnoException;
              });
              break;
            case 'createFileSync':
              mockFsOpenSync.mockImplementationOnce(function () {
                throw { code: 'EACCES' } as NodeJS.ErrnoException;
              });
              break;
          }

          try {
            mktemp[method]('XXXXX.tmp');
            throw new Error('Expected error but got none');
          } catch (err) {
            assert.ok((err as NodeJS.ErrnoException).code === 'EACCES');
          }
        }
      );
    });
  });
});

describe('generateUniqueName', function () {
  it('should throw error if parameter is not a string', function () {
    try {
      mktemp.generateUniqueName(123 as unknown as string);
    } catch (err: unknown) {
      assert.ok(err instanceof TypeError);
      return;
    }

    throw new Error('Expected TypeError but got none');
  });
});
