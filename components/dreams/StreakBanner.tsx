import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface StreakBannerProps {
  currentStreak: number;
  longestStreak: number;
}

export default function StreakBanner({ currentStreak, longestStreak }: StreakBannerProps) {
  const getStreakMessage = () => {
    if (currentStreak === 0) return 'Start your dream journal journey!';
    if (currentStreak === 1) return 'Great start! Keep it going!';
    if (currentStreak < 7) return 'You\'re building momentum!';
    if (currentStreak < 30) return 'Amazing dedication!';
    return 'Dream journaling master!';
  };

  const getStreakEmoji = () => {
    if (currentStreak === 0) return '🌙';
    if (currentStreak < 7) return '⭐';
    if (currentStreak < 30) return '🔥';
    return '🏆';
  };

  return (
    <View className="mb-4 px-5">
      <LinearGradient
        colors={currentStreak > 0 ? ['#8B5CF6', '#6366F1'] : ['#6B7280', '#4B5563']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl"
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 5,
          borderRadius: 16,
        }}
      >
      <View className="flex-row items-center justify-between">
        {/* Left side - Current streak */}
        <View className="flex-1">
          <View className="mb-2 flex-row items-center">
            <Text className="mr-2 text-3xl">{getStreakEmoji()}</Text>
            <View>
              <Text className="text-3xl font-bold text-white">{currentStreak}</Text>
              <Text className="text-xs uppercase tracking-wide text-white/80">Day Streak</Text>
            </View>
          </View>
          <Text className="text-sm text-white/90">{getStreakMessage()}</Text>
        </View>

        {/* Right side - Longest streak */}
        <View className="ml-4 items-center rounded-xl bg-white/20 px-4 py-3">
          <View className="mb-1 flex-row items-center">
            <Feather name="award" size={16} color="#FFFFFF" />
            <Text className="ml-1.5 text-xl font-bold text-white">{longestStreak}</Text>
          </View>
          <Text className="text-xs text-white/80">Best</Text>
        </View>
      </View>

      {/* Progress bar */}
      {currentStreak > 0 && (
        <View className="mt-4">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="text-xs text-white/70">Next milestone</Text>
            <Text className="text-xs font-semibold text-white">
              {currentStreak < 7 ? '7 days' : currentStreak < 30 ? '30 days' : '100 days'}
            </Text>
          </View>
          <View className="h-2 overflow-hidden rounded-full bg-white/20">
            <View
              className="h-full rounded-full bg-white"
              style={{
                width: `${currentStreak < 7 
                  ? (currentStreak / 7) * 100 
                  : currentStreak < 30 
                  ? (currentStreak / 30) * 100 
                  : (currentStreak / 100) * 100}%`,
              }}
            />
          </View>
        </View>
      )}
      </LinearGradient>
    </View>
  );
}

