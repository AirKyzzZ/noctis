import React, { useRef } from 'react';
import { View, Text, Image, Pressable, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProfile } from '../../providers/ProfileContext';
import { useTheme } from '../../providers/ThemeContext';
import { useRouter } from 'expo-router';

interface HomeHeaderProps {
  onSettingsPress?: () => void;
}

export default function HomeHeader({ onSettingsPress }: HomeHeaderProps) {
  const { profile } = useProfile();
  const { toggleTheme, isDark, colors } = useTheme();
  const router = useRouter();
  
  // Animation for theme toggle button
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // Capitalize first letter of name
  const capitalizeFirstLetter = (text: string) => {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };
  
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

  const handleProfilePress = () => {
    router.push('/(tabs)/profile');
  };

  const handleThemeToggle = () => {
    // Animate button press
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.85,
          useNativeDriver: true,
          speed: 50,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }),
    ]).start();

    // Reset rotation for next animation
    setTimeout(() => {
      rotateAnim.setValue(0);
    }, 300);

    toggleTheme();
  };

  return (
    <View className="px-6 py-4">
      <View className="flex-row items-center justify-between mb-2">
        {/* Left: User Photo - now clickable */}
        <Pressable onPress={handleProfilePress} className="w-12 active:opacity-70">
          {profile?.profilePicture ? (
            <Image
              source={{ uri: profile.profilePicture }}
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: colors.gray200 }}
            />
          ) : (
            <View 
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.gray200 }}
            >
              <Feather name="user" size={20} color={colors.textTertiary} />
            </View>
          )}
        </Pressable>

        {/* Center: Welcome Text */}
        <View className="flex-1 items-center justify-center px-4">
          <Text 
            className="text-lg font-semibold text-center"
            style={{ color: colors.textPrimary }}
          >
            Welcome{profile?.name ? `, ${capitalizeFirstLetter(profile.name)}` : ''}
          </Text>
          <Text 
            className="text-xs mt-1 text-center"
            style={{ color: colors.textSecondary }}
          >
            {getCurrentDate()}
          </Text>
        </View>

        {/* Right: Theme Toggle Button */}
        <View className="w-12 items-end">
          <Pressable
            onPress={handleThemeToggle}
          >
            <Animated.View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ 
                backgroundColor: colors.gray100,
                transform: [
                  { scale: scaleAnim },
                  { 
                    rotate: rotateAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '180deg'],
                    })
                  }
                ]
              }}
            >
              <Feather 
                name={isDark ? 'sun' : 'moon'} 
                size={20} 
                color={colors.textPrimary} 
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

