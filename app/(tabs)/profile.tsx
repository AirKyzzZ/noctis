import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthContext';

export default function ProfileScreen() {
  const { exitApp } = useAuth();

  const handleExitApp = async () => {
    Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: async () => {
          await exitApp();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-8">Profile</Text>
        
        <View className="gap-4 mb-8">
          <Text className="text-base text-gray-600">
            Your app data is stored locally on this device.
          </Text>
        </View>
        
        <Pressable
          onPress={handleExitApp}
          className="bg-red-600 py-4 rounded-xl active:opacity-80"
        >
          <Text className="text-white text-center font-bold text-lg">Exit App</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

