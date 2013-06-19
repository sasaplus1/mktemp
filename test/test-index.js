var assert = require('chai').assert,
    index = require('../'),
    mktemp = require('../lib/mktemp');

suite('index', function() {

  test('check interface', function() {
    assert.deepEqual(
        index,
        {
          createFile: mktemp.createFile,
          createFileSync: mktemp.createFileSync,
          createDir: mktemp.createDir,
          createDirSync: mktemp.createDirSync
        },
        'mktemp should be this interface');
  });

});
