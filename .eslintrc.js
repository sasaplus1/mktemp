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
      files: ['**/*.ts'],
      rules: {
        'node/no-unsupported-features/es-syntax': 'off'
      }
    },
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
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint'],
  root: true,
  settings: {
    node: {
      tryExtensions: ['.ts', '.js', '.json', '.node']
    }
  }
};
