import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../services/ThemeService';
import { useAchievements } from '../services/AchievementService';
import { AchievementCard, AchievementStatsDisplay } from '../components/achievements';

type FilterType = 'all' | 'unlocked' | 'locked';
type CategoryType = 'all' | 'streak' | 'dream_type' | 'quantity' | 'quality' | 'exploration';

export default function AchievementsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { achievements, stats, loading } = useAchievements();
  const [filter, setFilter] = useState<FilterType>('all');
  const [category, setCategory] = useState<CategoryType>('all');

  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'unlocked' && achievement.unlocked) ||
      (filter === 'locked' && !achievement.unlocked);

    const matchesCategory = category === 'all' || achievement.category === category;

    return matchesFilter && matchesCategory;
  });

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unlocked', label: 'Unlocked' },
    { id: 'locked', label: 'Locked' },
  ];

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: 'grid' },
    { id: 'streak', label: 'Streaks', icon: 'zap' },
    { id: 'dream_type', label: 'Types', icon: 'moon' },
    { id: 'quantity', label: 'Quantity', icon: 'bar-chart' },
    { id: 'quality', label: 'Quality', icon: 'star' },
    { id: 'exploration', label: 'Explorer', icon: 'compass' },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Pressable onPress={() => router.back()} className="mr-4 active:opacity-70">
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </Pressable>
            <View className="flex-1">
              <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                Achievements
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                Track your dream journaling journey
              </Text>
            </View>
          </View>

          {/* Stats */}
          <AchievementStatsDisplay stats={stats} />

          {/* Filter Tabs */}
          <View className="flex-row gap-2 mb-4">
            {filters.map(f => (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                className="flex-1 py-2 px-3 rounded-lg active:opacity-70"
                style={{
                  backgroundColor: filter === f.id ? colors.accent : colors.gray100,
                }}
              >
                <Text
                  className="text-sm font-semibold text-center"
                  style={{
                    color: filter === f.id ? '#FFFFFF' : colors.textPrimary,
                  }}
                >
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Category Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
            contentContainerStyle={{ gap: 8 }}
          >
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                className="flex-row items-center py-2 px-4 rounded-full active:opacity-70"
                style={{
                  backgroundColor: category === cat.id ? colors.accent : colors.gray100,
                }}
              >
                <Feather
                  name={cat.icon as any}
                  size={14}
                  color={category === cat.id ? '#FFFFFF' : colors.textPrimary}
                  style={{ marginRight: 6 }}
                />
                <Text
                  className="text-sm font-semibold"
                  style={{
                    color: category === cat.id ? '#FFFFFF' : colors.textPrimary,
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Achievements List */}
          {filteredAchievements.length > 0 ? (
            filteredAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))
          ) : (
            <View className="py-12 items-center">
              <Text className="text-lg mb-2" style={{ color: colors.textSecondary }}>
                No achievements found
              </Text>
              <Text className="text-sm" style={{ color: colors.textTertiary }}>
                Keep journaling to unlock more!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

