import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';

interface EmptyStateProps {
  hasActiveFilters: boolean;
}

export default function EmptyState({ hasActiveFilters }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className="mb-4 items-center justify-center rounded-full"
        style={{ width: 80, height: 80, backgroundColor: colors.gray100 }}
      >
        <Feather name="search" size={36} color={colors.textTertiary} />
      </View>
      <Text className="mb-2 text-center text-xl font-bold" style={{ color: colors.textPrimary }}>
        No dreams found
      </Text>
      <Text className="text-center text-sm" style={{ color: colors.textSecondary }}>
        {hasActiveFilters
          ? 'Try adjusting your filters to see more results'
          : 'Start by searching or applying filters'}
      </Text>
    </View>
  );
}

