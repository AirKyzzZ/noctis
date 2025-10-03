import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfile } from '../../providers/ProfileContext';

export default function HomeScreen() {
  const { profile } = useProfile();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-3xl font-bold text-gray-900 mb-4">
          Bienvenue{profile?.name ? `, ${profile.name}` : ''} ! 👋
        </Text>
        <Text className="text-gray-600 text-center">
          Votre journal de rêves personnel vous attend.
        </Text>
      </View>
    </SafeAreaView>
  );
}

