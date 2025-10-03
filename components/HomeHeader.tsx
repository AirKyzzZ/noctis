import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProfile } from '../providers/ProfileContext';

interface HomeHeaderProps {
  onSettingsPress?: () => void;
}

export default function HomeHeader({ onSettingsPress }: HomeHeaderProps) {
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
    if (onSettingsPress) {
      onSettingsPress();
    } else {
      // TODO: Navigate to settings page when it's created
    }
  };

  return (
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
  );
}

