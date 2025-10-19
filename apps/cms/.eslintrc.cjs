const sharedConfig = require.resolve('@portfolio/config/eslint');

module.exports = {
  root: true,
  extends: [sharedConfig],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
  },
  ignorePatterns: ['dist', 'node_modules'],
};
