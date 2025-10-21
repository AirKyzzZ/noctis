import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useDreams } from '../../services/DreamService';
import { useTheme } from '../../services/ThemeService';
import DreamGraph from './DreamGraphCard';

export default function StatsOverview() {
  const router = useRouter();
  const { stats, dreams } = useDreams();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Calculate dreams this week
  const getDreamsThisWeek = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return dreams.filter(dream => {
      const dreamDate = new Date(dream.dateTime);
      return dreamDate >= weekAgo && dreamDate <= today;
    }).length;
  };

  const dreamsThisWeek = getDreamsThisWeek();

  return (
    <View className="mx-4 mb-3">
      {/* Header */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
          {t('home.statsOverview')}
        </Text>
        <Pressable
          onPress={() => router.push('/(tabs)/dreams')}
          className="flex-row items-center"
        >
          <Text className="mr-1 text-sm font-semibold" style={{ color: colors.accent }}>
            {t('common.seeMore')}
          </Text>
          <Feather name="arrow-right" size={14} color={colors.accent} />
        </Pressable>
      </View>

      {/* Stats Grid */}
      <View className="flex-row" style={{ height: 140 }}>
        {/* Left Card - Dream Graph */}
        <DreamGraph />

        {/* Right Side - Stacked Cards */}
        <View className="w-1/2 pl-1.5">
          {/* Yellow Card - Current Streak */}
          <View className="mb-3" style={{ flex: 1 }}>
            <View
              className="flex-1 flex-row items-center rounded-2xl p-2.5"
              style={{
                backgroundColor: '#F59E0B', // Yellow/Amber
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              {/* Icon */}
              <View
                className="mr-2 items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                }}
              >
                <Feather name="zap" size={16} color="#FFFFFF" />
              </View>

              {/* Value */}
              <View className="flex-1">
                <Text className="text-xl font-bold text-white">
                  {stats.currentStreak}
                  <Text className="text-xs text-white/80">
                    {' '}{stats.currentStreak === 1 ? t('dreams.day') : t('dreams.days')}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-white/90">
                  {t('dreams.stats.currentStreak')}
                </Text>
              </View>
            </View>
          </View>

          {/* Green Card - This Week */}
          <View style={{ flex: 1 }}>
            <View
              className="flex-1 flex-row items-center rounded-2xl p-2.5"
              style={{
                backgroundColor: '#10B981', // Green
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              {/* Icon */}
              <View
                className="mr-2 items-center justify-center rounded-full"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                }}
              >
                <Feather name="calendar" size={16} color="#FFFFFF" />
              </View>

              {/* Value */}
              <View className="flex-1">
                <Text className="text-xl font-bold text-white">
                  {dreamsThisWeek}
                  <Text className="text-xs text-white/80">
                    {' '}{dreamsThisWeek === 1 ? t('tabs.dreams').toLowerCase() : t('tabs.dreams').toLowerCase()}
                  </Text>
                </Text>
                <Text className="text-xs font-medium text-white/90">
                  {t('home.thisWeek')}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
