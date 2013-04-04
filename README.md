# mktemp  [![Build Status](https://travis-ci.org/sasaplus1/mktemp.png)](https://travis-ci.org/sasaplus1/mktemp)

mktemp for node.js

## Installation

```sh
$ npm install mktemp
```

## Usage

```js
var mktemp = require('mktemp');

mktemp.createFile('file-XXXXXX', function(err, path) {
  if (err) throw err;
  console.log(path);  // match for /^file-[\da-zA-Z]{6}$/
});

mktemp.createFileSync('file-XXX');
// return value is match for /^file-[\da-zA-Z]{3}$/

mktemp.createDir('dir-XXXXX', function(err, path) {
  if (err) throw err;
  console.log(path);  // match for /^dir-[\da-zA-Z]{5}$/
});

mktemp.createDirSync('dir-XXX');
// return value is match for /^dir-[\da-zA-Z]{3}$/
```

mktemp functions replace to random string from placeholder of "X" near end of line.

```js
'XXXXXXXXXXX'  // /^[\da-zA-Z]{11}$/
'abc-XXXXXXX'  // /^abc-[\da-zA-Z]{7}$/
'XXX-XXXXXXX'  // /^XXX-[\da-zA-Z]{7}$/
'XXX-XXX.tmp'  // /^XXX-[\da-zA-Z]{3}\.tmp$/
```

## Functions

### createFile(path, [mode,] callback)

  * `path` string - file path
  * `mode` number - permission (default: 0777)
  * `callback` function(err, path) - callback function
    * `err` - error object
    * `path` - replaced path

create blank file of random filename.

### createFileSync(path, [mode])

  * `path` string - file path
  * `mode` number - permission (default: 0777)
  * `return` string - replaced path

sync version createFile.

### createDir(path, [mode,] callback)

  * `path` string - dir path
  * `mode` number - permission (default: 0777)
  * `callback` function(err, path) - callback function
    * `err` - error object
    * `path` - replaced path

create directory of random dirname.

### createDirSync(path, [mode])

  * `path` string - dir path
  * `mode` number - permission (default: 0777)
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

The MIT License. Please see LICENSE file.
