/**
 * random table string and table length.
 */
var TABLE = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    TABLE_LEN = TABLE.length;

function matchPlaceholder(template) {
  return template.match(/(X+)[^X]*$/);
}

/**
 * count the number of possible outcomes for the template
 *
 * @param {String} template template string.
 * @throws {TypeError} if template is not a String.
 * @return {Number} count of possible outcomes.
 */
function outcomeCount(template) {
  var matches;

  if (typeof template !== 'string') {
    throw new TypeError('template must be a String: ' + template);
  }

  matches = matchPlaceholder(template);

  if (matches === null) {
    return 1;
  }
  else {
    return Math.pow(TABLE_LEN, matches[1].length);
  }
}

/**
 * generate random string from template.
 *
 * replace for placeholder "X" in template.
 * return template if not has placeholder.
 *
 * @param {String} template template string.
 * @throws {TypeError} if template is not a String.
 * @return {String} replaced string.
 */
function generate(template) {
  var match, i, len, result;

  if (typeof template !== 'string') {
    throw new TypeError('template must be a String: ' + template);
  }

  match = matchPlaceholder(template);

  // return template if not has placeholder
  if (match === null) {
    return template;
  }

  // generate random string
  for (result = '', i = 0, len = match[1].length; i < len; ++i) {
    result += TABLE[Math.floor(Math.random() * TABLE_LEN)];
  }

  // concat template and random string
  return template.slice(0, match.index) + result +
      template.slice(match.index + result.length);
}


/**
 * export.
 */
module.exports = {
  generate: generate,
  outcomeCount: outcomeCount
};
