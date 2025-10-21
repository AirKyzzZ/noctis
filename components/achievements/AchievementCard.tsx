import React from 'react';
import { View, Text } from 'react-native';
import { Achievement } from '../../types/achievement';
import { useTheme } from '../../services/ThemeService';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { colors } = useTheme();

  const rarityColors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };

  const rarityLabels = {
    common: 'Common',
    rare: 'Rare',
    epic: 'Epic',
    legendary: 'Legendary',
  };

  const progressPercentage = Math.min((achievement.progress / achievement.requirement) * 100, 100);
  const borderColor = achievement.unlocked ? rarityColors[achievement.rarity] : colors.gray300;

  return (
    <View
      className="rounded-xl p-4 mb-3"
      style={{
        backgroundColor: colors.gray100,
        borderWidth: 2,
        borderColor,
        opacity: achievement.unlocked ? 1 : 0.7,
      }}
    >
      <View className="flex-row items-start">
        {/* Icon */}
        <View className="mr-3">
          <Text className="text-4xl">{achievement.icon}</Text>
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
              {achievement.title}
            </Text>
            {achievement.unlocked && <Text className="text-lg">✓</Text>}
          </View>

          <Text className="text-sm mb-2" style={{ color: colors.textSecondary }}>
            {achievement.description}
          </Text>

          {/* Rarity Badge */}
          <View className="flex-row items-center justify-between">
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: rarityColors[achievement.rarity] + '20' }}
            >
              <Text
                className="text-xs font-semibold"
                style={{ color: rarityColors[achievement.rarity] }}
              >
                {rarityLabels[achievement.rarity]}
              </Text>
            </View>

            {/* Progress */}
            {!achievement.unlocked && (
              <Text className="text-xs" style={{ color: colors.textTertiary }}>
                {achievement.progress} / {achievement.requirement}
              </Text>
            )}
          </View>

          {/* Progress Bar */}
          {!achievement.unlocked && (
            <View className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.gray200 }}>
              <View
                className="h-full rounded-full"
                style={{
                  backgroundColor: rarityColors[achievement.rarity],
                  width: `${progressPercentage}%`,
                }}
              />
            </View>
          )}

          {/* Unlocked Date */}
          {achievement.unlocked && achievement.unlockedAt && (
            <Text className="text-xs mt-2" style={{ color: colors.textTertiary }}>
              Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

