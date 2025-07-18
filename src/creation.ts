import fs from 'node:fs';

import { generateUniqueName, getOutcomeCount } from './unique_name';

/* -----------------------------------------------------------------------------
 * private
 * -------------------------------------------------------------------------- */

type Callback = (
  err: NodeJS.ErrnoException | null,
  path: string | null
) => void;

type TryCreateParams = {
  callback: Callback;
  isDir: boolean;
  mode: fs.Mode;
  retryCount: number;
  template: string;
};

/** permission of 0600 -r-------- */
const _r________ = 384; /* =0o600 */
/** permission of 0700 -rw------- */
const _rw_______ = 448; /* =0o700 */

/**
 * getOutcomeCount("X") * 1 → 1 - (35/36)^(36*1) = 0.63728996689
 * ≈ 63%
 * 63% chance of success, 37% chance of failure
 *
 * getOutcomeCount("X") * 3 → 1 - (35/36)^(36*3) = 0.9522823874
 * ≈ 95%
 * 95% chance of success, 5% chance of failure
 */
const RETRY_MULTIPLIER = 3;

/**
 * check mode is fs.Mode
 *
 * @param mode - target value
 * @returns true if mode is fs.Mode
 */
function isMode(mode: unknown): mode is fs.Mode {
  return typeof mode === 'number' || typeof mode === 'string';
}

/**
 * check error is NodeJS.ErrnoException
 *
 * @param error - target value
 * @returns true if error is NodeJS.ErrnoException
 */
function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
  if (typeof error === 'object' && error !== null) {
    return 'code' in (error as NodeJS.ErrnoException);
  }

  return false;
}

/**
 * try create unique name file or directory
 */
function tryCreate({
  callback,
  isDir,
  mode,
  retryCount,
  template
}: TryCreateParams) {
  const path = generateUniqueName(template);

  const fn = function (err: NodeJS.ErrnoException | null, fd?: number): void {
    if (err) {
      if (err.code === 'EEXIST') {
        // NOTE: EEXIST error
        if (retryCount > 0) {
          setImmediate(tryCreate, {
            callback,
            isDir,
            mode,
            retryCount: retryCount - 1,
            template
          });
        } else {
          callback(new RangeError('over max retry count'), null);
        }
      } else {
        // NOTE: other errors
        callback(err, null);
      }

      return;
    }

    if (fd) {
      fs.close(fd, function (err) {
        callback(err, path);
      });
    } else {
      callback(null, path);
    }
  };

  if (isDir) {
    fs.mkdir(path, mode, fn);
  } else {
    fs.open(path, 'ax+', mode, fn);
  }
}

/* -----------------------------------------------------------------------------
 * public / createFile
 * -------------------------------------------------------------------------- */

/**
 * create unique name file
 *
 * @param template - template string for filename
 * @returns result with Promise
 */
export function createFile(template: string): Promise<string | null>;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @param mode - permission
 * @returns result with Promise
 */
export function createFile(
  template: string,
  mode: fs.Mode
): Promise<string | null>;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @param callback - callback function
 */
export function createFile(template: string, callback: Callback): void;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @param mode - permission
 * @param callback - callback function
 */
export function createFile(
  template: string,
  mode: fs.Mode,
  callback: Callback
): void;

export function createFile(
  template: string,
  mode: fs.Mode | Callback = _r________,
  callback?: Callback
): void | Promise<string | null> {
  if (typeof mode === 'function') {
    callback = mode;
    mode = _r________;
  }

  // NOTE: if don't pass mode argument, mode is initialize to _r________

  if (typeof callback !== 'function') {
    return new Promise(function (resolve, reject) {
      // NOTE: maybe unreachable to else statement, this code is for the tsc
      if (isMode(mode)) {
        createFile(template, mode, function (err, path) {
          if (err) {
            reject(err);
          } else {
            resolve(path);
          }
        });
      } else {
        reject(new TypeError(`mode must be a fs.Mode: ${mode}`));
      }
    });
  }

  tryCreate({
    callback,
    isDir: false,
    mode,
    retryCount: getOutcomeCount(template) * RETRY_MULTIPLIER,
    template
  });
}

/**
 * create unique name file, sync version
 *
 * @param template - template string for filename
 * @returns unique filename
 */
export function createFileSync(template: string): string;
/**
 * create unique name file, sync version
 *
 * @param template - template string for filename
 * @param mode - permission
 * @returns unique filename
 */
export function createFileSync(template: string, mode: fs.Mode): string;

export function createFileSync(
  template: string,
  mode: fs.Mode = _r________
): string {
  let path: string;
  let isExist: boolean;

  let retryCount = getOutcomeCount(template);

  do {
    isExist = false;
    path = generateUniqueName(template);

    let fd: number | null = null;

    try {
      fd = fs.openSync(path, 'ax+', mode);
    } catch (err) {
      if (isErrnoException(err) && err.code === 'EEXIST') {
        if (retryCount > 0) {
          isExist = true;
        } else {
          throw new RangeError('over max retry count');
        }
      } else {
        throw err;
      }
    } finally {
      if (fd !== null) {
        fs.closeSync(fd);
      }
    }

    retryCount -= 1;
  } while (isExist);

  return path;
}

/* -----------------------------------------------------------------------------
 * public / createDir
 * -------------------------------------------------------------------------- */

/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @returns result with Promise
 */
export function createDir(template: string): Promise<string | null>;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @param mode - permission
 * @returns result with Promise
 */
export function createDir(
  template: string,
  mode: fs.Mode
): Promise<string | null>;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @param callback - callback function
 */
export function createDir(template: string, callback: Callback): void;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @param mode - permission
 * @param callback - callback function
 */
export function createDir(
  template: string,
  mode: fs.Mode,
  callback: Callback
): void;

export function createDir(
  template: string,
  mode: fs.Mode | Callback = _rw_______,
  callback?: Callback
): void | Promise<string | null> {
  if (typeof mode === 'function') {
    callback = mode;
    mode = _rw_______;
  }

  // NOTE: if don't pass mode argument, mode is initialize to _rw_______

  if (typeof callback !== 'function') {
    return new Promise(function (resolve, reject) {
      // NOTE: maybe unreachable to else statement, this code is for the tsc
      if (isMode(mode)) {
        createDir(template, mode, function (err, path) {
          if (err) {
            reject(err);
          } else {
            resolve(path);
          }
        });
      } else {
        reject(new TypeError(`mode must be a fs.Mode: ${mode}`));
      }
    });
  }

  tryCreate({
    callback,
    isDir: true,
    mode,
    retryCount: getOutcomeCount(template) * RETRY_MULTIPLIER,
    template
  });
}

/**
 * create unique name directory, sync version
 *
 * @param template - template string for dirname
 * @returns unique filename
 */
export function createDirSync(template: string): string;
/**
 * create unique name directory, sync version
 *
 * @param template - template string for dirname
 * @returns unique filename
 */
export function createDirSync(template: string, mode: fs.Mode): string;

export function createDirSync(
  template: string,
  mode: fs.Mode = _rw_______
): string {
  let path: string;
  let isExist: boolean;

  let retryCount = getOutcomeCount(template);

  do {
    isExist = false;
    path = generateUniqueName(template);

    try {
      fs.mkdirSync(path, mode);
    } catch (err) {
      if (isErrnoException(err) && err.code === 'EEXIST') {
        if (retryCount > 0) {
          isExist = true;
        } else {
          throw new RangeError('over max retry count');
        }
      } else {
        throw err;
      }
    }

    retryCount -= 1;
  } while (isExist);

  return path;
}
