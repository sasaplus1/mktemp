/**
 * @file for directory processing
 */
/// <reference types="node" />
/**
 * create unique name directory
 *
 * @param {string} template template string for file directory
 * @param {Function} [callback]
 * @return {Promise}
 */
export declare function createDir(template: string, callback?: (err: NodeJS.ErrnoException | null, dirname: string | null) => void): undefined | Promise<string | null>;
/**
 * sync version createDir
 *
 * @param {string} template template string for directory name
 * @throws {Error} if caught error
 * @return {string} dirname
 */
export declare function createDirSync(template: string): string;
