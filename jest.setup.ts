// Test environment setup

// Silence nativewind className warnings in tests
// eslint-disable-next-line @typescript-eslint/no-empty-function

// Mock expo-constants to avoid accessing native modules
jest.mock('expo-constants', () => ({
  expoConfig: { extra: {} },
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
  const Noop = (..._args: any[]) => null;
  return new Proxy(
    {},
    {
      get: () => Noop,
    }
  );
});

// Mock react-native-safe-area-context to avoid provider requiring native metrics
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: any }) => children,
  SafeAreaView: ({ children }: { children: any }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo-router to avoid runtime issues in tests
jest.mock('expo-router', () => ({
  Slot: ({ children }: { children?: any }) => children || null,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  Stack: ({ children }: { children: any }) => children,
  Tabs: ({ children }: { children: any }) => children,
}));

// Mock expo-router/entry
jest.mock('expo-router/entry', () => ({}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));


