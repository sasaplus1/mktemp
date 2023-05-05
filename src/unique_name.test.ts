import { strict as assert } from 'node:assert';

import { generateUniqueName, getOutcomeCount } from './unique_name';

describe('unique_name', function () {
  describe('generateUniqueName()', function () {
    it('should generated random string', function () {
      const result1 = generateUniqueName('X-XXX');

      assert(/^X-[\da-zA-Z]{3}$/.test(result1));
      assert(result1 !== 'X-XXX');

      const result2 = generateUniqueName('XXX.tmp');

      assert(/^[\da-zA-Z]{3}\.tmp$/.test(result2));
      assert(result2 !== 'XXX.tmp');
    });

    it('should returned template string', function () {
      assert(generateUniqueName('template') === 'template');
    });
  });

  describe('getOutcomeCount()', function () {
    it('returns 1 when missing template placeholders', function () {
      assert(getOutcomeCount('no-placeholder') === 1);
    });

    it('returns 62 when template has a single placeholder', function () {
      assert(getOutcomeCount('short-placeholder-X') === 62);
    });

    it('returns 3521614606208 when template has 7 placeholders', function () {
      assert(getOutcomeCount('short-placeholder-XXXXXXX') === 3521614606208);
    });
  });
});
