module.exports = {
  preset: 'jest-expo',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|react-native-.*|@react-navigation|expo(-.*)?|@expo|jest-expo|@unimodules|unimodules-.*|sentry-expo)/)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    '^expo-font$': '<rootDir>/__mocks__/expo-font.js',
  },
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/node_modules/**', '!**/coverage/**'],
};


