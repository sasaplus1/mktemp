var expect = require('expect.js'),
    randomstring = require('../lib/randomstring');

describe('randomstring', function() {

  describe('#generate()', function() {

    it('should generated str, match to /^X-[\\da-zA-Z]{3}$/', function() {
      var result = randomstring.generate('X-XXX');

      expect(result).to.match(/^X-[\da-zA-Z]{3}$/);
      expect(result).not.to.be('X-XXX');
    });

    it('should generated str, match to /^[\\da-zA-Z]{3}\.tmp$/', function() {
      var result = randomstring.generate('XXX.tmp');

      expect(result).to.match(/^[\da-zA-Z]{3}\.tmp$/);
      expect(result).not.to.be('XXX.tmp');
    });

    it('should returned template string', function() {
      expect(randomstring.generate('template')).to.be('template');
    });

  });

});
