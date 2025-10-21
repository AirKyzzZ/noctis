import React from 'react';
import { View, Text } from 'react-native';
import { AchievementStats as Stats } from '../../types/achievement';
import { useTheme } from '../../services/ThemeService';

interface AchievementStatsProps {
  stats: Stats;
}

export function AchievementStatsDisplay({ stats }: AchievementStatsProps) {
  const { colors } = useTheme();

  const rarityColors = {
    common: '#9CA3AF',
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B',
  };

  return (
    <View className="mb-6">
      {/* Completion Progress */}
      <View className="rounded-xl p-4 mb-4" style={{ backgroundColor: colors.gray100 }}>
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
            Overall Progress
          </Text>
          <Text className="text-base font-bold" style={{ color: colors.accent }}>
            {stats.completionPercentage}%
          </Text>
        </View>
        <View className="h-3 rounded-full overflow-hidden mb-2" style={{ backgroundColor: colors.gray200 }}>
          <View
            className="h-full rounded-full"
            style={{
              backgroundColor: colors.accent,
              width: `${stats.completionPercentage}%`,
            }}
          />
        </View>
        <Text className="text-sm" style={{ color: colors.textSecondary }}>
          {stats.totalUnlocked} of {stats.totalAchievements} achievements unlocked
        </Text>
      </View>

      {/* Rarity Breakdown */}
      <View className="rounded-xl p-4" style={{ backgroundColor: colors.gray100 }}>
        <Text className="text-base font-semibold mb-3" style={{ color: colors.textPrimary }}>
          Achievements by Rarity
        </Text>
        <View className="gap-2">
          {Object.entries(rarityColors).map(([rarity, color]) => (
            <View key={rarity} className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: color }}
                />
                <Text className="text-sm capitalize" style={{ color: colors.textSecondary }}>
                  {rarity}
                </Text>
              </View>
              <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
                {stats.rarityCount[rarity as keyof typeof stats.rarityCount]}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Last Unlocked */}
      {stats.lastUnlocked && (
        <View className="rounded-xl p-4 mt-4" style={{ backgroundColor: colors.gray100 }}>
          <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
            Recently Unlocked
          </Text>
          <View className="flex-row items-center">
            <Text className="text-3xl mr-3">{stats.lastUnlocked.icon}</Text>
            <View className="flex-1">
              <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
                {stats.lastUnlocked.title}
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {stats.lastUnlocked.description}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

