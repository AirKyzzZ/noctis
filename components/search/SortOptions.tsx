import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';

export type SortOption = 'date-desc' | 'date-asc' | 'clarity-desc' | 'clarity-asc' | 'quality-desc';

interface SortOptionsProps {
  selectedSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'clarity-desc', label: 'Highest Clarity' },
  { value: 'clarity-asc', label: 'Lowest Clarity' },
  { value: 'quality-desc', label: 'Best Sleep Quality' },
];

export default function SortOptions({ selectedSort, onSortChange }: SortOptionsProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center ml-4">
      <Feather name="sliders" size={16} color={colors.textSecondary} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="ml-2">
        {sortOptions.map(option => (
          <Pressable
            key={option.value}
            onPress={() => onSortChange(option.value)}
            className="ml-2 rounded-lg px-3 py-2"
            style={{
              backgroundColor: selectedSort === option.value ? colors.accentLight : colors.gray100,
            }}
          >
            <Text
              className="text-xs font-medium"
              style={{
                color: selectedSort === option.value ? colors.accent : colors.textSecondary,
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

