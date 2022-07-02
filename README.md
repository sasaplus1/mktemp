# mktemp

[![test](https://github.com/sasaplus1/mktemp/actions/workflows/test.yml/badge.svg)](https://github.com/sasaplus1/mktemp/actions/workflows/test.yml)
[![npm version](https://badge.fury.io/js/mktemp.svg)](https://badge.fury.io/js/mktemp)
[![Try mktemp on RunKit](https://badge.runkitcdn.com/mktemp.svg)](https://npm.runkit.com/mktemp)

mktemp command for node.js

## Installation

### npm

```bash
$ npm install mktemp
```

### yarn

```bash
$ yarn add mktemp
```

## Usage

### createFile

```js
const mktemp = require('mktemp');

async function main() {
  const path = await mktemp.createFile('./XXX.txt');

  // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
  console.log(path);
}
main();
```

callback style:

```js
const mktemp = require('mktemp');

mktemp.createFile('./XXX.txt', function (err, path) {
  if (err) throw err;

  // path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
  console.log(path);
});
```

sync version:

```js
const mktemp = require('mktemp');

// path match a /^\.\/[0-9a-zA-Z]{3}\.txt$/
const path = mktemp.createFileSync('./XXX.txt');
```

### createDir

```js
const mktemp = require('mktemp');

async function main() {
  const path = await mktemp.createDir('./XXX');

  // path match a /^\.\/[0-9a-zA-Z]{3}$/
  console.log(path);
}
main();
```

callback style:

```js
const mktemp = require('mktemp');

mktemp.createDir('./XXX', function (err, path) {
  if (err) throw err;

  // path match a /^\.\/[0-9a-zA-Z]{3}$/
  console.log(path);
});
```

sync version:

```js
const mktemp = require('mktemp');

// path match a /^\.\/[0-9a-zA-Z]{3}$/
const path = mktemp.createDirSync('./XXX');
```

### Permissions

some create functions are can pass permissions:

```js
const path = await mktemp.createDir('./XXX', 0o600);
```

if create file or directory is unexpected permissions, see below:

- [`fs.mkdir` is creating the directory with different permissions than those specified](https://stackoverflow.com/questions/30815154/fs-mkdir-is-creating-the-directory-with-different-permissions-than-those-speci)
- [process.umask(mask)](https://nodejs.org/dist/latest-v16.x/docs/api/process.html#processumaskmask)

## Functions

see [docs](docs) or https://sasaplus1.github.io/mktemp

## Contributors

- [Michael Ficarra](https://github.com/michaelficarra)
- [rjz](https://github.com/rjz)

## License

The MIT license.
