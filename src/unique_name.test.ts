import assert = require('assert');

import * as uniqueName from '../src/unique_name';

describe('uniqueName', function () {
  describe('.getOutcomeCount()', function () {
    describe('when missing template placeholders', function () {
      it('returns 1', function () {
        assert(1 === uniqueName.getOutcomeCount('no-placeholder'));
      });
    });

    describe('when template has a single placeholder', function () {
      // 62 == TABLE_LEN
      it('returns 62', function () {
        assert(62 === uniqueName.getOutcomeCount('short-placeholder-X'));
      });
    });

    describe('when template has 7 placeholders', function () {
      // 3521614606208 == TABLE_LEN ^ 7
      it('returns 3521614606208', function () {
        assert(
          3521614606208 ===
            uniqueName.getOutcomeCount('short-placeholder-XXXXXXX')
        );
      });
    });
  });

  describe('.generate()', function () {
    it('should generated random string', function () {
      var result;

      result = uniqueName.generate('X-XXX');
      assert(/^X-[\da-zA-Z]{3}$/.test(result));
      assert(result !== 'X-XXX');

      result = uniqueName.generate('XXX.tmp');
      assert(/^[\da-zA-Z]{3}\.tmp$/.test(result));
      assert(result !== 'XXX.tmp');
    });

    it('should returned template string', function () {
      assert(uniqueName.generate('template') === 'template');
    });
  });
});
