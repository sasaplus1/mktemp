/// <reference types="node" />
/// <reference types="node" />
import * as fs from 'fs';
declare type Callback = (err: NodeJS.ErrnoException | null, path: string | null) => void;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created file permission is `0600`.
 *
 * @example
 *
 * Promise:
 *
 * ```js
 * createFile('./XXX.txt').then(
 *   // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 *   path => console.log(path)
 * );
 * ```
 *
 * async/await:
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 * const path = await createFile('./XXX.txt');
 * ```
 */
export declare function createFile(template: string): Promise<string | null>;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @param mode - permission
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @example
 *
 * Promise:
 *
 * ```js
 * createFile('./XXX.txt', 0o600).then(
 *   // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 *   path => console.log(path)
 * );
 * ```
 *
 * async/await:
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 * const path = await createFile('./XXX.txt', 0o600);
 * ```
 */
export declare function createFile(template: string, mode: fs.Mode): Promise<string | null>;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @param callback - callback function
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created file permission is `0600`.
 *
 * @example
 *
 * ```js
 * createFile('./XXX.txt', function(err, path) {
 *   if (err) throw err;
 *
 *   // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 *   console.log(path);
 * });
 * ```
 */
export declare function createFile(template: string, callback: Callback): void;
/**
 * create unique name file
 *
 * @param template - template string for filename
 * @param mode - permission
 * @param callback - callback function
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @example
 *
 * ```js
 * createFile('./XXX.txt', 0o600, function(err, path) {
 *   if (err) throw err;
 *
 *   // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 *   console.log(path);
 * });
 * ```
 */
export declare function createFile(template: string, mode: fs.Mode, callback: Callback): void;
/**
 * create unique name file, sync version
 *
 * @param template - template string for filename
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created file permission is `0600`.
 *
 * @example
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 * const path = createFileSync('./XXX.txt');
 * ```
 */
export declare function createFileSync(template: string): string;
/**
 * create unique name file, sync version
 *
 * @param template - template string for filename
 * @param mode - permission
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @example
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
 * const path = createFileSync('./XXX.txt', 0o600);
 * ```
 */
export declare function createFileSync(template: string, mode: fs.Mode): string;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created directory permission is `0700`.
 *
 * @example
 *
 * Promise:
 *
 * ```js
 * createDir('./XXX').then(
 *   // path match a /^\.\/[0-9a-zA-Z]{3}$/
 *   path => console.log(path)
 * );
 * ```
 *
 * async/await:
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}$/
 * const path = await createDir('./XXX');
 * ```
 */
export declare function createDir(template: string): Promise<string | null>;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @param mode - permission
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @example
 *
 * Promise:
 *
 * ```js
 * createDir('./XXX', 0o700).then(
 *   // path match a /^\.\/[0-9a-zA-Z]{3}$/
 *   path => console.log(path)
 * );
 * ```
 *
 * async/await:
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}$/
 * const path = await createDir('./XXX', 0o700);
 * ```
 */
export declare function createDir(template: string, mode: fs.Mode): Promise<string | null>;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @param callback - callback function
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created directory permission is `0700`.
 *
 * @example
 *
 * ```js
 * createDir('./XXX', function(err, path) {
 *   if (err) throw err;
 *
 *   // path match a /^\.\/[0-9a-zA-Z]{3}$/
 *   console.log(path);
 * });
 * ```
 */
export declare function createDir(template: string, callback: Callback): void;
/**
 * create unique name directory
 *
 * @param template - template string for dirname
 * @param mode - permission
 * @param callback - callback function
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created directory permission is `0700`.
 *
 * @example
 *
 * ```js
 * createDir('./XXX', 0o700, function(err, path) {
 *   if (err) throw err;
 *
 *   // path match a /^\.\/[0-9a-zA-Z]{3}$/
 *   console.log(path);
 * });
 * ```
 */
export declare function createDir(template: string, mode: fs.Mode, callback: Callback): void;
/**
 * create unique name directory, sync version
 *
 * @param template - template string for dirname
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created file permission is `0700`.
 *
 * @example
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}$/
 * const path = createDirSync('./XXX');
 * ```
 */
export declare function createDirSync(template: string): string;
/**
 * create unique name directory, sync version
 *
 * @param template - template string for dirname
 * @returns path
 * @see {@link generateUniqueName} replacing rules
 *
 * @throws RangeError
 * if over retry count
 *
 * @throws Error
 * otherwise
 *
 * @remarks
 *
 * created file permission is `0700`.
 *
 * @example
 *
 * ```js
 * // path match a /^\.\/[0-9a-zA-Z]{3}$/
 * const path = createDirSync('./XXX', 0o700);
 * ```
 */
export declare function createDirSync(template: string, mode: fs.Mode): string;
export {};
