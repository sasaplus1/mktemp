module.exports = {
  linters: {
    '*.js': 'npx --no-install eslint --cache',
    '*.yml': [
      'npx --no-install prettier --parser yaml --write',
      'git diff --exit-code --quiet'
    ],
    '!(package|package-lock).json': [
      'npx --no-install prettier --parser json-stringify --write',
      'git diff --exit-code --quiet'
    ],
    'package.json': [
      'npx fixpack',
      'npx --no-install prettier --parser json-stringify --write',
      'git diff --exit-code --quiet'
    ]
  }
};
