import React, { useEffect, useRef } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from '../services/AuthService';
import { ProfileProvider } from '../services/ProfileService';
import { DreamProvider } from '../services/DreamService';
import { ThemeProvider, useTheme } from '../services/ThemeService';
import { MoonProvider } from '../services/MoonService';
import { NotificationProvider, useNotifications } from '../services/NotificationService';
import { AchievementProvider } from '../services/AchievementService';
import { I18nProvider } from '../services/I18nProvider';
import { useFonts } from 'expo-font';
import { Text, TextInput, Animated, StyleSheet, StatusBar } from 'react-native';
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
  const { addNotification } = useNotifications();
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

  // Listen for notification responses (when user taps on a notification)
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as {
        type?: string;
        actionUrl?: string;
      };

      // Add notification to in-app list
      if (data.type) {
        addNotification({
          type: data.type as any,
          title: response.notification.request.content.title || 'Notification',
          message: response.notification.request.content.body || '',
          actionUrl: data.actionUrl,
        });
      }

      // Navigate to action URL if available
      if (data.actionUrl && isAuthenticated) {
        router.push(data.actionUrl as any);
      }
    });

    return () => subscription.remove();
  }, [isAuthenticated]);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        animated
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
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <DreamProvider>
              <AchievementProvider>
                <MoonProvider>
                  <NotificationProvider>
                    <RootLayoutNav />
                  </NotificationProvider>
                </MoonProvider>
              </AchievementProvider>
            </DreamProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
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


