import React, { useEffect, useRef } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../providers/AuthContext';
import { ProfileProvider } from '../providers/ProfileContext';
import { DreamProvider } from '../providers/DreamContext';
import { ThemeProvider, useTheme } from '../providers/ThemeContext';
import { useFonts } from 'expo-font';
import { Text, TextInput, View, Animated, StyleSheet, StatusBar } from 'react-native';
import { ConfettiEffect } from '../components/auth/ConfettiEffect';
import '../global.css';

function ThemeTransitionOverlay() {
  const { isTransitioning, isDark } = useTheme();
  const opacity = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    if (isTransitioning) {
      setShouldRender(true);
      // Fade in quickly, then fade out
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [isTransitioning]);

  if (!shouldRender) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity,
          backgroundColor: isDark ? '#000000' : '#FFFFFF',
        },
      ]}
      pointerEvents="none"
    />
  );
}

function RootLayoutNav() {
  const { isAuthenticated, loading, showConfetti } = useAuth();
  const { isDark } = useTheme();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to welcome if not authenticated
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, loading, segments]);

  // Update status bar style based on theme
  useEffect(() => {
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        animated={true}
      />
      <Slot />
      {showConfetti && <ConfettiEffect />}
      <ThemeTransitionOverlay />
    </>
  );
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
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <DreamProvider>
            <RootLayoutNav />
          </DreamProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
});


