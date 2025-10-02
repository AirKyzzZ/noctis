import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo } from '../../components/auth/Logo';
import { ConfettiEffect } from '../../components/auth/ConfettiEffect';
import { IntroText } from '../../components/auth/IntroText';
import { CTAButtons } from '../../components/auth/CTAButtons';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignUpForm } from '../../components/auth/SignUpForm';

export default function WelcomeScreen() {
  const [screen, setScreen] = useState<'welcome' | 'login' | 'signup'>('welcome');
  const [showConfetti, setShowConfetti] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (screen === 'login') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View className="flex-1 justify-center bg-white">
          <LoginForm
            onSuccess={() => setScreen('welcome')}
            onSignUpPress={() => setScreen('signup')}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (screen === 'signup') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View className="flex-1 bg-white pt-8">
          <SignUpForm
            onSuccess={() => setScreen('login')}
            onLoginPress={() => setScreen('login')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1e3a8a', '#3b82f6', '#60a5fa']} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          {showConfetti && <ConfettiEffect />}
          <View className="flex-1 justify-center items-center">
            <Logo />
            <IntroText />
            <CTAButtons
              onLoginPress={() => setScreen('login')}
              onSignUpPress={() => setScreen('signup')}
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});

