"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDirSync = exports.createDir = exports.createFileSync = exports.createFile = void 0;
const fs = __importStar(require("fs"));
const unique_name_1 = require("./unique_name");
/** permission of 0600 -r-------- */
const _r________ = 384; /* =0o600 */
/** permission of 0700 -rw------- */
const _rw_______ = 448; /* =0o700 */
/**
 * check mode is fs.Mode
 *
 * @internal
 * @param mode - target value
 * @returns true if mode is fs.Mode
 */
function isMode(mode) {
    return typeof mode === 'number' || typeof mode === 'string';
}
/**
 * check error is NodeJS.ErrnoException
 *
 * @internal
 * @param error - target value
 * @returns true if error is NodeJS.ErrnoException
 */
function isErrnoException(error) {
    if (typeof error === 'object' && error !== null) {
        return 'code' in error;
    }
    return false;
}
/**
 * try create unique name file or directory
 *
 * @internal
 */
function tryCreate({ callback, isDir, mode, retryCount, template }) {
    const path = (0, unique_name_1.generateUniqueName)(template);
    const fn = function (err, fd) {
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
                }
                else {
                    callback(new RangeError('over max retry count'), null);
                }
            }
            else {
                // NOTE: other errors
                callback(err, null);
            }
            return;
        }
        if (fd) {
            fs.close(fd, function (err) {
                callback(err, path);
            });
        }
        else {
            callback(null, path);
        }
    };
    if (isDir) {
        fs.mkdir(path, mode, fn);
    }
    else {
        fs.open(path, 'ax+', mode, fn);
    }
}
function createFile(template, mode = _r________, callback) {
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
                    err ? reject(err) : resolve(path);
                });
            }
            else {
                reject(new TypeError(`mode must be a fs.Mode: ${mode}`));
            }
        });
    }
    tryCreate({
        callback,
        isDir: false,
        mode,
        retryCount: (0, unique_name_1.getOutcomeCount)(template),
        template
    });
}
exports.createFile = createFile;
function createFileSync(template, mode = _r________) {
    let path;
    let isExist;
    let retryCount = (0, unique_name_1.getOutcomeCount)(template);
    do {
        isExist = false;
        path = (0, unique_name_1.generateUniqueName)(template);
        let fd = null;
        try {
            fd = fs.openSync(path, 'ax+', mode);
        }
        catch (err) {
            if (isErrnoException(err) && err.code === 'EEXIST') {
                if (retryCount > 0) {
                    isExist = true;
                }
                else {
                    throw new RangeError('over max retry count');
                }
            }
            else {
                throw err;
            }
        }
        finally {
            if (fd !== null) {
                fs.closeSync(fd);
            }
        }
        retryCount -= 1;
    } while (isExist);
    return path;
}
exports.createFileSync = createFileSync;
function createDir(template, mode = _rw_______, callback) {
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
                    err ? reject(err) : resolve(path);
                });
            }
            else {
                reject(new TypeError(`mode must be a fs.Mode: ${mode}`));
            }
        });
    }
    tryCreate({
        callback,
        isDir: true,
        mode,
        retryCount: (0, unique_name_1.getOutcomeCount)(template),
        template
    });
}
exports.createDir = createDir;
function createDirSync(template, mode = _rw_______) {
    let path;
    let isExist;
    let retryCount = (0, unique_name_1.getOutcomeCount)(template);
    do {
        isExist = false;
        path = (0, unique_name_1.generateUniqueName)(template);
        try {
            fs.mkdirSync(path, mode);
        }
        catch (err) {
            if (isErrnoException(err) && err.code === 'EEXIST') {
                if (retryCount > 0) {
                    isExist = true;
                }
                else {
                    throw new RangeError('over max retry count');
                }
            }
            else {
                throw err;
            }
        }
        retryCount -= 1;
    } while (isExist);
    return path;
}
exports.createDirSync = createDirSync;
//# sourceMappingURL=creation.js.map