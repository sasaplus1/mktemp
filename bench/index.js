var benchmark = require('benchmark'),
    mkrand = require('../lib/mkrand'),
    suite = new benchmark.Suite,
    str100, str1000000;

suite
  .add('100', {
    fn: function() {
      mkrand(str100);
    },
    onStart: function() {
      str100 = Array(100 + 1).join('X');
    },
    onComplete: function(event) {
      console.log(String(event.target));
    }
  })
  .add('1,000,000', {
    fn: function() {
      mkrand(str1000000);
    },
    onStart: function() {
      str1000000 = Array(1000000 + 1).join('X');
    },
    onComplete: function(event) {
      console.log(String(event.target));
    }
  })
  .run({
    async: true
  });
