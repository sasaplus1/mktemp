# mktemp

[![Build Status](https://travis-ci.org/sasaplus1/mktemp.png)](https://travis-ci.org/sasaplus1/mktemp)
[![Dependency Status](https://gemnasium.com/sasaplus1/mktemp.png)](https://gemnasium.com/sasaplus1/mktemp)

mktemp command for node.js

## Installation

```sh
$ npm install mktemp
```

## Usage

```js
var mktemp = require('mktemp');

mktemp.createFile('file-XXXXXX', function(err, path) {
  if (err) throw err;
  console.log(path);  // match to /^file-[\da-zA-Z]{6}$/
});

mktemp.createFileSync('file-XXX');
// return value is match to /^file-[\da-zA-Z]{3}$/

mktemp.createDir('dir-XXXXX', function(err, path) {
  if (err) throw err;
  console.log(path);  // match to /^dir-[\da-zA-Z]{5}$/
});

mktemp.createDirSync('dir-XXX');
// return value is match to /^dir-[\da-zA-Z]{3}$/
```

mktemp functions replace to unique name from "X" at near end of line.

```js
mktemp.createFileSync('XXXXXXXXXXX');  // match to /^[\da-zA-Z]{11}$/
mktemp.createFileSync('abc-XXXXXXX');  // match to /^abc-[\da-zA-Z]{7}$/
mktemp.createFileSync('XXX-XXXXXXX');  // match to /^XXX-[\da-zA-Z]{7}$/
mktemp.createFileSync('XXX-XXX.tmp');  // match to /^XXX-[\da-zA-Z]{3}\.tmp$/
```

## Functions

### createFile(template, callback)

  * `template` string - filename template
  * `callback` function(err, path) - callback function
    * `err` - error object
    * `path` - replaced path

create blank file of unique filename.
permission is `0600`.

### createFileSync(template)

  * `template` string - filename template
  * `return` string - replaced path

sync version createFile.

### createDir(template, callback)

  * `template` string - dirname template
  * `callback` function(err, path) - callback function
    * `err` - error object
    * `path` - replaced path

create directory of unique dirname.
permission is `0700`.

### createDirSync(template)

  * `template` string - dirname template
  * `return` string - replaced path

sync version createDir.

## Test

```sh
$ npm install
$ npm test
```

## Contributors

  * [Michael Ficarra](https://github.com/michaelficarra)

## License

The MIT license. Please see LICENSE file.
