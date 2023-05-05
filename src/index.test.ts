import assert from 'node:assert/strict';

import * as mktemp from './index';

describe('index', function () {
  it('should export createFile', function () {
    assert(typeof mktemp.createFile === 'function');
  });
  it('should export createFileSync', function () {
    assert(typeof mktemp.createFileSync === 'function');
  });
  it('should export createDir', function () {
    assert(typeof mktemp.createDir === 'function');
  });
  it('should export createDirSync', function () {
    assert(typeof mktemp.createDirSync === 'function');
  });
  it('should export generateUniqueName', function () {
    assert(typeof mktemp.generateUniqueName === 'function');
  });
});
