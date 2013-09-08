var expect = require('expect.js'),
    mktemp = require('../lib');

describe('index', function() {

  it('should export some functions', function() {
    expect(require('../')).to.eql({
      createFile: mktemp.createFile,
      createFileSync: mktemp.createFileSync,
      createDir: mktemp.createDir,
      createDirSync: mktemp.createDirSync
    });
  });

});
