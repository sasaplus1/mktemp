const typescriptExtends = [
  'eslint:recommended',
  'plugin:@typescript-eslint/eslint-recommended',
  'plugin:@typescript-eslint/recommended',
  'plugin:node/recommended-module',
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
  excludedFiles: './test/*.ts',
  files: ['./src/*.ts'],
  plugins: [...typescriptPlugins],
  rules: {
    ...tsdocRules
  },
  settings: {
    node: {
      tryExtensions
    }
  }
});

overrides.push({
  extends: typescriptExtends,
  files: ['./test/*.ts'],
  plugins: [...typescriptPlugins],
  rules: {
    ...tsdocRules
  },
  settings: {
    node: {
      // NOTE: no effect
      // allowModules: ['node:assert', 'node:test'],
      tryExtensions
    }
  }
});

config.env = {
  es6: true,
  node: true
};
config.extends = ['eslint:recommended', 'plugin:node/recommended', 'prettier'];
config.overrides = overrides;
config.parserOptions = {
  ecmaVersion: 'latest',
  sourceType: 'module'
};
config.root = true;

module.exports = config;
