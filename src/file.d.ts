/**
 * @file for file processing
 */
/// <reference types="node" />
/**
 * create unique name file
 *
 * @param {string} template template string for file name
 * @param {Function} [callback]
 * @return {Promise}
 */
export declare function createFile(template: string, callback?: (err: NodeJS.ErrnoException | null, filename: string | null) => void): undefined | Promise<string | null>;
/**
 * sync version createFile
 *
 * @param {string} template template string for file name
 * @throws {Error} if caught error
 * @return {string} filename
 */
export declare function createFileSync(template: string): string;
