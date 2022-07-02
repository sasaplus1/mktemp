/**
 * count the number of possible outcomes for the template
 *
 * @internal
 * @param template - template string
 * @returns count of possible outcomes
 *
 * @throws TypeError
 * if template is not a string
 */
export declare function getOutcomeCount(template: string): number;
/**
 * generate unique name
 *
 * @param template - template string
 * @returns unique name string
 *
 * @throws TypeError
 * if template is not a string
 *
 * @example
 *
 * `X` is replace to random character:
 *
 * ```js
 * // uniqueName match a /^[0-9a-zA-Z]{3}$/
 * const uniqueName = generateUniqueName('XXX');
 * ```
 *
 * `X` is replace to random character with prefix:
 *
 * ```js
 * // uniqueName match a /^tmp-[0-9a-zA-Z]{3}$/
 * const uniqueName = generateUniqueName('tmp-XXX');
 * ```
 *
 * can not replace if `X` is prefix:
 *
 * ```js
 * // uniqueName match a /^XXX-tmp$/
 * const uniqueName = generateUniqueName('XXX-tmp');
 * ```
 */
export declare function generateUniqueName(template: string): string;
