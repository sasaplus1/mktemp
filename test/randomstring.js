var assert = require('power-assert'),
  randomstring = require('../lib/randomstring');

describe('randomstring', function() {
  describe('.outcomeCount()', function() {
    describe('when missing template placeholders', function() {
      it('returns 1', function() {
        assert.equal(1, randomstring.outcomeCount('no-placeholder'));
      });
    });

    describe('when template has a single placeholder', function() {
      // 62 == TABLE_LEN
      it('returns 62', function() {
        assert.equal(62, randomstring.outcomeCount('short-placeholder-X'));
      });
    });

    describe('when template has 7 placeholders', function() {
      // 3521614606208 == TABLE_LEN ^ 7
      it('returns 3521614606208', function() {
        assert.equal(
          3521614606208,
          randomstring.outcomeCount('short-placeholder-XXXXXXX')
        );
      });
    });
  });

  describe('.generate()', function() {
    it('should generated random string', function() {
      var result;

      result = randomstring.generate('X-XXX');
      assert(/^X-[\da-zA-Z]{3}$/.test(result));
      assert(result !== 'X-XXX');

      result = randomstring.generate('XXX.tmp');
      assert(/^[\da-zA-Z]{3}\.tmp$/.test(result));
      assert(result !== 'XXX.tmp');
    });

    it('should returned template string', function() {
      assert(randomstring.generate('template') === 'template');
    });
  });
});
