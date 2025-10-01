module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-.*|@react-navigation|expo(-.*)?|@expo|jest-expo|@unimodules|unimodules-.*|sentry-expo)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/coverage/**'],
};


