import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';

interface SearchHeaderProps {
  activeFilterCount: number;
  onClearFilters: () => void;
}

export default function SearchHeader({ activeFilterCount, onClearFilters }: SearchHeaderProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-4 flex-row items-center justify-between">
      <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
        🔎 Search Dreams
      </Text>
      {activeFilterCount > 0 && (
        <Pressable
          onPress={onClearFilters}
          className="flex-row items-center rounded-full px-3 py-1.5"
          style={{ backgroundColor: colors.accentLight }}
        >
          <Feather name="x" size={14} color={colors.accent} />
          <Text className="ml-1 text-xs font-semibold" style={{ color: colors.accent }}>
            Clear ({activeFilterCount})
          </Text>
        </Pressable>
      )}
    </View>
  );
}

