/**
 * @file for file processing
 */

import * as fs from 'fs';

import * as uniqueName from './unique_name';

/**
 * try create unique name file
 *
 * @param {string} template template string for file name
 * @param {number} retryCount
 * @param {Function} [callback]
 */
function tryCreateFile(
  template: string,
  retryCount: number,
  callback: (err: NodeJS.ErrnoException | null, filename: string | null) => void
): void {
  let filename: string | null = uniqueName.generate(template);

  fs.open(filename, 'ax+', 384 /*=0600*/, function (err, fd) {
    if (err) {
      if (err.code === 'EEXIST' && retryCount > 0) {
        setImmediate(tryCreateFile, template, retryCount - 1, callback);

        return;
      }

      // filename set to null if throws error
      filename = null;
    }

    if (fd) {
      fs.close(fd, function (err) {
        callback(err, filename);
      });
    } else {
      callback(err, filename);
    }
  });
}

/**
 * create unique name file
 *
 * @param {string} template template string for file name
 * @param {Function} [callback]
 * @return {Promise}
 */
export function createFile(
  template: string,
  callback?: (
    err: NodeJS.ErrnoException | null,
    filename: string | null
  ) => void
): undefined | Promise<string | null> {
  if (typeof callback !== 'function') {
    return new Promise(function (resolve, reject) {
      createFile(template, (err, filename) =>
        err ? reject(err) : resolve(filename)
      );
    });
  }

  const retryCount = uniqueName.getOutcomeCount(template);

  tryCreateFile(template, retryCount, callback);
}

/**
 * sync version createFile
 *
 * @param {string} template template string for file name
 * @throws {Error} if caught error
 * @return {string} filename
 */
export function createFileSync(template: string): string {
  let fd: number | null = null;
  let filename: string;
  let isExist: boolean;

  let retryCount = uniqueName.getOutcomeCount(template);

  do {
    isExist = false;
    retryCount -= 1;
    filename = uniqueName.generate(template);

    try {
      fd = fs.openSync(filename, 'ax+', 384 /*=0600*/);
    } catch (e) {
      if (e.code === 'EEXIST' && retryCount > 0) {
        isExist = true;
      } else {
        throw e;
      }
    } finally {
      fd && fs.closeSync(fd);
    }
  } while (isExist);

  return filename;
}
