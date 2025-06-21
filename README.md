# mktemp

create temporary files and directories

## Installation

```sh
$ npm install mktemp
```

## Usage

```js
import * as os from 'node:os';
import * as path from 'node:path';
import * as mktemp from 'mktemp';

const tempDir = os.tmpdir();

mktemp.createFile(path.join(tempDir, 'XXXXX.txt'), function (err, path) {
  if (err) throw err;
  // path match a /^[\da-zA-Z]{5}\.txt$/
  console.log(path);
});

// return value match a /^[\da-zA-Z]{5}\.tmp$/
mktemp.createFileSync(path.join(tempDir, 'XXXXX.tmp'));

mktemp.createDir(path.join(tempDir, 'XXXXXXX'), function (err, path) {
  if (err) throw err;
  // path match a /^[\da-zA-Z]{7}$/
  console.log(path);
});

// return value match a /^XXX-[\da-zA-Z]{3}$/
mktemp.createDirSync(path.join(tempDir, 'XXX-XXX'));
```

if support Promise, can use Promise style.

```js
import * as mktemp from 'mktemp';

mktemp
  .createFile('XXXXX.txt')
  .then(function (path) {
    // path match a /^[\da-zA-Z]{5}\.txt$/
    console.log(path);
  })
  .catch(function (err) {
    console.error(err);
  });

mktemp
  .createDir('XXXXX')
  .then(function (path) {
    // path match a /^[\da-zA-Z]{5}$/
    console.log(path);
  })
  .catch(function (err) {
    console.error(err);
  });
```

mktemp functions are replace to random string from placeholder "X" in template. see example:

```js
mktemp.createFileSync('XXXXXXX'); // match a /^[\da-zA-Z]{7}$/
mktemp.createFileSync('XXX.tmp'); // match a /^[\da-zA-Z]{3}\.tmp$/
mktemp.createFileSync('XXX-XXX'); // match a /^XXX-[\da-zA-Z]{3}$/
```

## Functions

### createFile(template[, mode = 0o600[, callback]])

- `template`
  - `String` - filename template
- `mode`
  - `Number` - file permission mode (default: `0o600`)
- `callback`
  - `function(err, path)` - callback function
    - `err` : `Error|Null` - error object
    - `path` : `String` - path

create blank file of unique filename. return Promise if callback is not passed.

### createFileSync(template[, mode = 0o600])

- `template`
  - `String` - filename template
- `mode`
  - `Number` - file permission mode (default: `0o600`)
- `return`
  - `String` - path

sync version createFile.

### createDir(template[, mode = 0o700[, callback]])

- `template`
  - `String` - dirname template
- `mode`
  - `Number` - directory permission mode (default: `0o700`)
- `callback`
  - `function(err, path)` - callback function
    - `err` : `Error|Null` - error object
    - `path` : `String` - path

create directory of unique dirname. return Promise if callback is not passed.

### createDirSync(template[, mode = 0o700])

- `template`
  - `String` - dirname template
- `mode`
  - `Number` - directory permission mode (default: `0o700`)
- `return`
  - `String` - path

sync version createDir.

## Contributors

- [Michael Ficarra](https://github.com/michaelficarra)
- [rjz](https://github.com/rjz)

## License

The MIT license.
