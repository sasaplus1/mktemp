const placeholderRegex = /(X+)[^X]*$/;
const table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const tableLength = table.length;
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
export function getOutcomeCount(template) {
    if (typeof template !== 'string') {
        throw new TypeError(`template must be a string: ${template}`);
    }
    const matches = template.match(placeholderRegex);
    if (matches === null || !matches[1]) {
        return 1;
    }
    return Math.pow(tableLength, matches[1].length);
}
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
export function generateUniqueName(template) {
    if (typeof template !== 'string') {
        throw new TypeError(`template must be a string: ${template}`);
    }
    const matches = template.match(placeholderRegex);
    if (matches === null || !matches[1]) {
        return template;
    }
    const result = [];
    for (let i = 0, len = matches[1].length; i < len; i += 1) {
        result.push(table[Math.floor(Math.random() * tableLength)]);
    }
    const { index = 0 } = matches;
    return (template.slice(0, index) +
        result.join('') +
        template.slice(index + result.length));
}
//# sourceMappingURL=unique_name.js.map