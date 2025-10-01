module.exports = {
  root: true,
  extends: [
    'universe/native',
    'universe/shared/typescript-analysis',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/', 'dist/', 'build/', 'coverage/', '.expo/', '.expo-shared/'],
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
  },
};


