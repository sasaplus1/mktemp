module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      env: {
        mocha: true
      },
      files: ['test/**/*.js'],
      rules: {
        'node/no-unpublished-import': 'off',
        'node/no-unpublished-require': 'off'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 2018
  },
  root: true
};
