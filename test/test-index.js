var expect = require('expect.js'),
    mktemp = require('../');

describe('index', function() {

  it('should export some functions', function() {
    expect(mktemp).to.eql({
      createFile: mktemp.createFile,
      createFileSync: mktemp.createFileSync,
      createDir: mktemp.createDir,
      createDirSync: mktemp.createDirSync
    });
  });

});
