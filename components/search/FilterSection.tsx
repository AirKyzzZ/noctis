import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeContext';

interface FilterSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function FilterSection({ title, isExpanded, onToggle, children }: FilterSectionProps) {
  const { colors } = useTheme();

  return (
    <View>
      <Pressable
        onPress={onToggle}
        className="mb-3 flex-row items-center justify-between"
      >
        <Text className="text-base font-semibold" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        <Feather
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
      {isExpanded && children}
    </View>
  );
}

