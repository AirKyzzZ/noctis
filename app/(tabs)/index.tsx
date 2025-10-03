import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useProfile } from '../../providers/ProfileContext';

export default function HomeScreen() {
  const { profile } = useProfile();
  
  // Get current date in a nice format
  const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const handleSettingsPress = () => {
    // TODO: Navigate to settings page when it's created
    console.log('Settings pressed');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-6 py-4">
        <View className="flex-row items-center justify-between mb-6">
          {/* Left: User Photo */}
          <View className="w-12">
            {profile?.profilePicture ? (
              <Image
                source={{ uri: profile.profilePicture }}
                className="w-12 h-12 rounded-full"
                style={{ backgroundColor: '#f3f4f6' }}
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                <Feather name="user" size={20} color="#9ca3af" />
              </View>
            )}
          </View>

          {/* Center: Welcome Text */}
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-lg font-semibold text-gray-900 text-center">
              Welcome{profile?.name ? `, ${profile.name}` : ''}
            </Text>
            <Text className="text-xs text-gray-500 mt-1 text-center">
              {getCurrentDate()}
            </Text>
          </View>

          {/* Right: Settings Button */}
          <View className="w-12 items-end">
            <Pressable
              onPress={handleSettingsPress}
              className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center active:opacity-70"
            >
              <Feather name="settings" size={20} color="#374151" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Rest of the content */}
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-gray-600 text-center">
          Your dream journal awaits.
        </Text>
      </View>
    </SafeAreaView>
  );
}

