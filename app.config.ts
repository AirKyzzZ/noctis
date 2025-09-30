import type { ExpoConfig } from 'expo/config';
import dotenv from 'dotenv';

// Load .env first, then override with .env.local if present
dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const config: ExpoConfig = {
  name: 'noctis',
  slug: 'noctis',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: ['expo-font'],
  extra: {
    // These are safe to expose in the client bundle. Do NOT put service_role here.
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  },
};

export default config;


