import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, assert, beforeEach, describe, it } from 'vitest';
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

describe('createFile & createFileSync', function () {
  describe('success cases', function () {
    let tempDir: string;

    beforeEach(async function () {
      tempDir = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), 'mktemp-test-createfile-')
      );
    });

    afterEach(async function () {
      await fs.promises.rm(tempDir, { recursive: true });
    });

    it('should create unique name file', function () {
      return new Promise<void>((resolve, reject) => {
        const template = path.join(tempDir, 'XXXXX.tmp');
        mktemp.createFile(template, function (err, resultPath): void {
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
            assert.strictEqual(actualMode, 0o600);
            resolve();
          });
        });
      });
    });

    it('should create unique name file with mode', function () {
      return new Promise<void>((resolve, reject) => {
        const template = path.join(tempDir, 'XXXXX.tmp');
        const mode = 0o600; // 384 in decimal
        mktemp.createFile(template, mode, function (err, resultPath): void {
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
    });

    it('should create unique name file, Promise version', async function () {
      const template = path.join(tempDir, 'XXXXX.tmp');
      const resultPath = await mktemp.createFile(template);

      assert.ok(resultPath !== null);

      const fileName = path.basename(resultPath);

      assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
      assert.ok(fs.existsSync(resultPath));

      // In Linux, the actual file mode contains the system default values,
      // so check that the specified permission bits are applied
      const stat = await fs.promises.stat(resultPath);
      const actualMode = stat.mode & parseInt('777', 8);
      assert.strictEqual(actualMode, 0o600);
    });

    it('should create unique name file with mode, Promise version', async function () {
      const template = path.join(tempDir, 'XXXXX.tmp');
      const mode = 0o600; // 384 in decimal
      const resultPath = await mktemp.createFile(template, mode);

      assert.ok(resultPath !== null);

      const fileName = path.basename(resultPath);

      assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
      assert.ok(fs.existsSync(resultPath));

      // In Linux, the actual file mode contains the system default values,
      // so check that the specified permission bits are applied
      const stat = await fs.promises.stat(resultPath);
      const actualMode = stat.mode & parseInt('777', 8);
      assert.strictEqual(actualMode, mode);
    });

    it('should create unique name file with, sync version', function () {
      const template = path.join(tempDir, 'XXXXX.tmp');
      const resultPath = mktemp.createFileSync(template);

      assert.ok(resultPath !== null);

      const fileName = path.basename(resultPath);

      assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
      assert.ok(fs.existsSync(resultPath));
      // In Linux, the actual file mode contains the system default values,
      // so check that the specified permission bits are applied
      const stat = fs.statSync(resultPath);
      const actualMode = stat.mode & parseInt('777', 8);
      assert.strictEqual(actualMode, 0o600);
    });

    it('should create unique name file with mode, sync version', function () {
      const template = path.join(tempDir, 'XXXXX.tmp');
      const mode = 0o600; // 384 in decimal
      const resultPath = mktemp.createFileSync(template, mode);

      assert.ok(resultPath !== null);

      const fileName = path.basename(resultPath);

      assert.ok(/^[\da-zA-Z]{5}\.tmp$/.test(fileName));
      assert.ok(fs.existsSync(resultPath));
      // In Linux, the actual file mode contains the system default values,
      // so check that the specified permission bits are applied
      const stat = fs.statSync(resultPath);
      const actualMode = stat.mode & parseInt('777', 8);
      assert.strictEqual(actualMode, mode);
    });
  });
});
