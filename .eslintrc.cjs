const sharedConfig = require.resolve('@portfolio/config/eslint');

module.exports = {
  extends: [sharedConfig],
  ignorePatterns: ['node_modules', 'dist', 'build'],
};
