import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Achievement } from '../../types/achievement';
import { useTheme } from '../../services/ThemeService';

interface AchievementBadgeProps {
  achievement: Achievement;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export function AchievementBadge({ achievement, onPress, size = 'medium' }: AchievementBadgeProps) {
  const { colors } = useTheme();

  const sizeStyles = {
    small: { container: 'w-16 h-20', icon: 'text-2xl', title: 'text-xs' },
    medium: { container: 'w-20 h-24', icon: 'text-3xl', title: 'text-sm' },
    large: { container: 'w-24 h-28', icon: 'text-4xl', title: 'text-base' },
  };

  const rarityColors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };

  const style = sizeStyles[size];
  const borderColor = achievement.unlocked ? rarityColors[achievement.rarity] : colors.gray300;

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={`${style.container} items-center justify-center active:opacity-70`}
    >
      <View
        className="w-full h-full items-center justify-center rounded-xl p-2"
        style={{
          backgroundColor: achievement.unlocked ? colors.gray100 : colors.gray100 + '40',
          borderWidth: 2,
          borderColor,
          opacity: achievement.unlocked ? 1 : 0.5,
        }}
      >
        <Text className={`${style.icon} mb-1`}>{achievement.icon}</Text>
        <Text
          className={`${style.title} text-center font-semibold`}
          style={{ color: colors.textPrimary }}
          numberOfLines={2}
        >
          {achievement.title}
        </Text>
      </View>
    </Pressable>
  );
}

