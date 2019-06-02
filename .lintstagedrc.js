module.exports = {
  linters: {
    '*.ts': 'npx --no-install eslint --cache --ext .ts',
    '*.yml': [
      'npx --no-install prettier --parser yaml --write',
      'git diff --exit-code --quiet'
    ],
    '!(package|package-lock).json': [
      'npx --no-install prettier --parser json-stringify --write',
      'git diff --exit-code --quiet'
    ],
    'package.json': [
      'npm run fixpack',
      'npx --no-install prettier --parser json-stringify --write',
      'git diff --exit-code --quiet'
    ]
  }
};
