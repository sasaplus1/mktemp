var expect = require('expect.js'),
    randomstring = require('../lib/randomstring');

describe('randomstring', function() {

  describe('#generate()', function() {

    it('should generated str, match to /^X-[\\da-zA-Z]{3}$/', function() {
      expect(randomstring.generate('X-XXX')).to.match(/^X-[\da-zA-Z]{3}$/);
    });

    it('should generated str, match to /^[\\da-zA-Z]{3}\.tmp$/', function() {
      expect(randomstring.generate('XXX.tmp')).to.match(/^[\da-zA-Z]{3}\.tmp$/);
    });

    it('should returned template string', function() {
      expect(randomstring.generate('template')).to.be('template');
    });

  });

});
