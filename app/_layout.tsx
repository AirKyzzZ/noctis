import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../providers/AuthContext';
import { useFonts } from 'expo-font';
import { Text, TextInput, View } from 'react-native';
import '../global.css';

function RootLayoutNav() {
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to welcome if not authenticated
      router.replace('/(auth)/welcome');
    } else if (session && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [session, loading, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'ProximaNova-Regular': require('../assets/ProximaNova/proximanova_regular.ttf'),
    'ProximaNova-Bold': require('../assets/ProximaNova/proximanova_bold.otf'),
    'ProximaNova-Light': require('../assets/ProximaNova/proximanova_light.otf'),
    'ProximaNova-Black': require('../assets/ProximaNova/proximanova_black.otf'),
    'ProximaNova-ExtraBold': require('../assets/ProximaNova/proximanova_extrabold.otf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = [
        (Text as any).defaultProps.style,
        { fontFamily: 'ProximaNova-Regular' },
      ];

      (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
      (TextInput as any).defaultProps.style = [
        (TextInput as any).defaultProps.style,
        { fontFamily: 'ProximaNova-Regular' },
      ];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}



