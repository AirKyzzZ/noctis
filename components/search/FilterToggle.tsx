import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';

interface FilterToggleProps {
  showFilters: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

export default function FilterToggle({ showFilters, onToggle, activeFilterCount }: FilterToggleProps) {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onToggle}
      className="flex-row items-center rounded-lg px-4 py-2"
      style={{ backgroundColor: showFilters ? colors.accent : colors.gray100 }}
    >
      <Feather name="filter" size={16} color={showFilters ? '#FFFFFF' : colors.textPrimary} />
      <Text
        className="ml-2 text-sm font-semibold"
        style={{ color: showFilters ? '#FFFFFF' : colors.textPrimary }}
      >
        Filters
      </Text>
      {activeFilterCount > 0 && (
        <View
          className="ml-2 items-center justify-center rounded-full"
          style={{ width: 20, height: 20, backgroundColor: showFilters ? '#FFFFFF' : colors.accent }}
        >
          <Text className="text-xs font-bold" style={{ color: showFilters ? colors.accent : '#FFFFFF' }}>
            {activeFilterCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

