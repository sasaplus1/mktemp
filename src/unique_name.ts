const placeholderRegex = /(X+)[^X]*$/;
const table = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const tableLength = table.length;

/**
 * count the number of possible outcomes for the template
 *
 * @param template - template string
 * @returns count of possible outcomes
 *
 * @throws {@link TypeError}
 * if template is not a string
 */
export function getOutcomeCount(template: string): number {
  if (typeof template !== 'string') {
    throw new TypeError(`template must be a string: ${template}`);
  }

  const matches = template.match(placeholderRegex);

  if (matches === null || !matches[1]) {
    return 1;
  }

  return tableLength ** matches[1].length;
}

/**
 * generate unique name
 *
 * @param template - template string
 * @returns unique name string
 *
 * @throws {@link TypeError}
 * if template is not a string
 */
export function generateUniqueName(template: string): string {
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

  return (
    template.slice(0, index) +
    result.join('') +
    template.slice(index + result.length)
  );
}
