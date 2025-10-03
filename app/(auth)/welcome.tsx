import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingCarousel } from '../../components/auth/OnboardingCarousel';
import { useAuth } from '../../providers/AuthContext';

export default function WelcomeScreen() {
  const { enterApp } = useAuth();

  const handleEnterApp = async () => {
    await enterApp();
  };

  return (
    <View style={styles.container}>
      <View className="flex-1 bg-white">
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <OnboardingCarousel onComplete={handleEnterApp} />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

