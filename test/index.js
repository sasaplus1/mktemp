var expect = require('expect.js'),
    mktemp = require('../');

describe('index', function() {

  it('should export some functions', function() {
    expect(mktemp).to.only.have.keys([
      'createFile',
      'createFileSync',
      'createDir',
      'createDirSync'
    ]);
  });

});
