const sharedConfig = require.resolve('@portfolio/config/eslint');

module.exports = {
  root: true,
  extends: [sharedConfig],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  settings: {
    'import/core-modules': ['next', 'next/link', 'next/navigation'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.json',
      },
    },
  },
  ignorePatterns: ['.next', 'dist', 'node_modules'],
};
