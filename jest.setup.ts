import 'whatwg-fetch';
import '@testing-library/jest-native/extend-expect';

// Silence nativewind className warnings in tests
// eslint-disable-next-line @typescript-eslint/no-empty-function
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock expo-constants to avoid accessing native modules
jest.mock('expo-constants', () => ({
  expoConfig: { extra: { supabaseUrl: '', supabaseAnonKey: '' } },
}));


