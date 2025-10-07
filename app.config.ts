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
  icon: './assets/white.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/white.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/white.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/white.png',
    bundler: 'metro',
  },
  scheme: 'noctis',
  plugins: [
    'expo-font',
    'expo-router',
    [
      'expo-image-picker',
      {
        photosPermission: 'The app needs access to your photos for your profile picture.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    STORMGLASS_API: process.env['STORMGLASS-API'] || process.env.STORMGLASS_API,
  },
};

export default config;


