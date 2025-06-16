const typescriptExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:n/recommended-module',
  'prettier'
];

const typescriptPlugins = ['eslint-plugin-tsdoc'];

const tsdocRules = {
  'tsdoc/syntax': 'warn'
};

const tryExtensions = ['.d.ts', '.ts', '.js', '.json'];

const config = {};
const overrides = [];

overrides.push({
  extends: typescriptExtends,
  files: ['./src/*.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: [...typescriptPlugins],
  rules: {
    ...tsdocRules
  },
  settings: {
    n: {
      tryExtensions
    }
  }
});

config.env = {
  es6: true,
  node: true
};
config.extends = ['eslint:recommended', 'plugin:n/recommended', 'prettier'];
config.overrides = overrides;
config.parserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module'
};
config.root = true;

module.exports = config;
