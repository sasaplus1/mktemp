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
  excludedFiles: ['./**/*.test.ts'],
  files: ['./**/*.ts'],
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
  files: ['./**/*.test.ts'],
  plugins: [...typescriptPlugins],
  rules: {
    ...tsdocRules
  },
  settings: {
    node: {
      allowModules: ['sinon'],
      tryExtensions
    }
  }
});

config.env = {
  browser: true,
  es6: true
};
config.extends = ['eslint:recommended', 'plugin:node/recommended', 'prettier'];
config.overrides = overrides;
config.parserOptions = {
  sourceType: 'module'
};
config.root = true;

module.exports = config;
