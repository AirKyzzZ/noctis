import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../../components/auth/Logo';
import { IntroText } from '../../components/auth/IntroText';
import { useAuth } from '../../providers/AuthContext';
import { colors } from '../../constants/colors';

export default function WelcomeScreen() {
  const { enterApp } = useAuth();

  const handleEnterApp = async () => {
    await enterApp();
  };

  return (
    <View style={styles.container}>
      <View className="flex-1 bg-white">
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View className="flex-1 justify-center items-center">
            <Logo />
            <IntroText />
            <View className="px-8 w-full">
              <Pressable
                onPress={handleEnterApp}
                className="py-4 rounded-xl active:opacity-80"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Enter App
                </Text>
              </Pressable>
            </View>
          </View>
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

