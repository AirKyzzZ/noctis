import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../providers/ThemeContext';

interface ChipSelectorProps<T extends string> {
  options: T[];
  selectedOptions: T[];
  onToggle: (option: T) => void;
}

export default function ChipSelector<T extends string>({
  options,
  selectedOptions,
  onToggle,
}: ChipSelectorProps<T>) {
  const { colors } = useTheme();

  return (
    <View className="mb-4 flex-row flex-wrap">
      {options.map(option => (
        <Pressable
          key={option}
          onPress={() => onToggle(option)}
          className="mb-2 mr-2 rounded-full px-4 py-2"
          style={{
            backgroundColor: selectedOptions.includes(option) ? colors.accent : colors.gray100,
          }}
        >
          <Text
            className="text-sm font-medium capitalize"
            style={{
              color: selectedOptions.includes(option) ? '#FFFFFF' : colors.textSecondary,
            }}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

