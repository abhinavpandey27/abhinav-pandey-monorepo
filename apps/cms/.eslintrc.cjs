const sharedConfig = require.resolve('@portfolio/config/eslint');

module.exports = {
  root: true,
  extends: [sharedConfig],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  env: {
    node: true,
  },
  settings: {
    'import/core-modules': ['payload/types'],
  },
  rules: {
    'import/namespace': 'off',
    'import/no-duplicates': 'off',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
