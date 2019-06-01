import assert = require('assert');

import { describe, it } from 'mocha';

import * as mktemp from '../';

describe('index', function() {
  it('should export some functions', function() {
    assert(typeof mktemp.createFile === 'function');
    assert(typeof mktemp.createFileSync === 'function');
    assert(typeof mktemp.createDir === 'function');
    assert(typeof mktemp.createDirSync === 'function');
  });
});
