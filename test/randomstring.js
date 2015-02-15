var assert = require('power-assert'),
    randomstring = require('../lib/randomstring');

describe('randomstring', function() {

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
