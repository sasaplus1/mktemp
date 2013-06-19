var benchmark = require('benchmark'),
    mkrand = require('../lib/mkrand'),
    suite = new benchmark.Suite,
    str8, str100, str1000000;

suite
  .add('8', {
    fn: function() {
      mkrand(str8);
    },
    onStart: function() {
      str8 = Array(8 + 1).join('X');
    }
  })
  .add('100', {
    fn: function() {
      mkrand(str100);
    },
    onStart: function() {
      str100 = Array(100 + 1).join('X');
    }
  })
  .add('1,000,000', {
    fn: function() {
      mkrand(str1000000);
    },
    onStart: function() {
      str1000000 = Array(1000000 + 1).join('X');
    }
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .run({
    async: true
  });
