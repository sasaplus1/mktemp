/**
 * @file for directory processing
 */

import * as fs from 'fs';

import * as uniqueName from './unique_name';

/**
 * try create unique name directory
 *
 * @param {string} template template string for directory name
 * @param {number} retryCount
 * @param {Function} callback
 */
function tryCreateDir(
  template: string,
  retryCount: number,
  callback: (err: NodeJS.ErrnoException | null, dirname: string | null) => void
): void {
  let dirname: string | null = uniqueName.generate(template);

  fs.mkdir(dirname, 448 /*=0700*/, function (err) {
    if (err) {
      if (err.code === 'EEXIST' && retryCount > 0) {
        setImmediate(tryCreateDir, template, retryCount - 1, callback);

        return;
      }

      // dirname set to null if throws error
      dirname = null;
    }

    callback(err, dirname);
  });
}

/**
 * create unique name directory
 *
 * @param {string} template template string for file directory
 * @param {Function} [callback]
 * @return {Promise}
 */
export function createDir(
  template: string,
  callback?: (err: NodeJS.ErrnoException | null, dirname: string | null) => void
): undefined | Promise<string | null> {
  if (typeof callback !== 'function') {
    return new Promise(function (resolve, reject) {
      createDir(template, (err, dirname) =>
        err ? reject(err) : resolve(dirname)
      );
    });
  }

  const retryCount = uniqueName.getOutcomeCount(template);

  tryCreateDir(template, retryCount, callback);
}

/**
 * sync version createDir
 *
 * @param {string} template template string for directory name
 * @throws {Error} if caught error
 * @return {string} dirname
 */
export function createDirSync(template: string): string {
  let dirname: string;
  let isExist: boolean;

  let retryCount = uniqueName.getOutcomeCount(template);

  do {
    isExist = false;
    retryCount -= 1;
    dirname = uniqueName.generate(template);

    try {
      fs.mkdirSync(dirname, 448 /*=0700*/);
    } catch (e) {
      if (e.code === 'EEXIST' && retryCount > 0) {
        isExist = true;
      } else {
        throw e;
      }
    }
  } while (isExist);

  return dirname;
}
