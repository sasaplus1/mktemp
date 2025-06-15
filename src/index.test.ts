import { describe, it, assert } from 'vitest';
import * as mktemp from './index';

describe('exports', function () {
  it.each([
    'createFile',
    'createFileSync',
    'createDir',
    'createDirSync',
    'generateUniqueName'
  ] as const)('should export %s', function (functionName: keyof typeof mktemp) {
    assert.strictEqual(typeof mktemp[functionName], 'function');
  });
});
