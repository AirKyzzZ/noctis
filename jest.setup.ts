// Test environment setup

// Silence nativewind className warnings in tests
// eslint-disable-next-line @typescript-eslint/no-empty-function

// Mock expo-constants to avoid accessing native modules
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { supabaseUrl: '', supabaseAnonKey: '' } },
}));

// Mock expo-font to prevent requiring native modules like expo-asset
jest.mock('expo-font', () => ({
  useFonts: () => [true],
  Font: {
    isLoaded: () => true,
    loadAsync: async () => {},
  },
}));

// Mock @expo/vector-icons to simple passthrough components to avoid font lookups
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  const FakeIcon = ({ name }: { name?: string }) => React.createElement(Text, null, name ?? 'icon');
  return new Proxy(
    {},
    {
      get: () => FakeIcon,
    }
  );
});

// Mock react-native-safe-area-context to avoid provider requiring native metrics
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: any }) => children,
  SafeAreaView: ({ children }: { children: any }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));


