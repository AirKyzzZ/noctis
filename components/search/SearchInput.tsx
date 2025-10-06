import React from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../providers/ThemeContext';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChangeText, placeholder = 'Search dreams, tags, characters...' }: SearchInputProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-3 flex-row items-center rounded-xl px-4" style={{ backgroundColor: colors.inputBackground }}>
      <Feather name="search" size={20} color={colors.textTertiary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        className="flex-1 py-3 px-3 text-base"
        style={{ color: colors.textPrimary }}
      />
      {value !== '' && (
        <Pressable onPress={() => onChangeText('')}>
          <Feather name="x" size={18} color={colors.textTertiary} />
        </Pressable>
      )}
    </View>
  );
}

