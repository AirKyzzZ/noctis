import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DreamStats } from '../../types/dream';
import { useTheme } from '../../providers/ThemeContext';

interface StatsGridProps {
  stats: DreamStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const { colors } = useTheme();
  const statItems = [
    {
      icon: 'book' as const,
      label: 'Total Dreams',
      value: stats.totalDreams.toString(),
      color: '#8B5CF6',
    },
    {
      icon: 'moon' as const,
      label: 'Avg Sleep Quality',
      value: stats.averageSleepQuality > 0 ? stats.averageSleepQuality.toFixed(1) : '0',
      color: '#3B82F6',
    },
    {
      icon: 'eye' as const,
      label: 'Avg Clarity',
      value: stats.averageClarity > 0 ? stats.averageClarity.toFixed(1) : '0',
      color: '#10B981',
    },
    {
      icon: 'zap' as const,
      label: 'Most Common',
      value: getMostCommonType(stats),
      color: '#F59E0B',
    },
  ];

  return (
    <View className="mx-4 mb-4 flex-row flex-wrap">
      {statItems.map((item, index) => (
        <View key={index} className="w-1/2 p-1.5">
          <View
            className="rounded-xl p-4"
            style={{
              backgroundColor: colors.cardBackground,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="mb-2 flex-row items-center justify-between">
              <View
                className="items-center justify-center rounded-full"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: `${item.color}15`,
                }}
              >
                <Feather name={item.icon} size={18} color={item.color} />
              </View>
            </View>
            <Text className="mb-1 text-2xl font-bold" style={{ color: colors.textPrimary }}>
              {item.value}
            </Text>
            <Text className="text-xs" style={{ color: colors.textTertiary }}>
              {item.label}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

function getMostCommonType(stats: DreamStats): string {
  const distribution = stats.dreamTypeDistribution;
  let maxCount = 0;
  let mostCommon = 'None';

  Object.entries(distribution).forEach(([type, count]) => {
    if (count > maxCount) {
      maxCount = count;
      mostCommon = type.charAt(0).toUpperCase() + type.slice(1);
    }
  });

  return mostCommon;
}

