/**
 * @file generate unique name
 */
/**
 * count the number of possible outcomes for the template
 *
 * @param {string} template template string
 * @throws {TypeError} if template is not a string
 * @return {number} count of possible outcomes
 */
export declare function getOutcomeCount(template: string): number;
/**
 * generate unique name
 *
 * @param {string} template template string
 * @throws {TypeError} if template is not a string
 * @return {string} unique name string
 */
export declare function generate(template: string): string;
