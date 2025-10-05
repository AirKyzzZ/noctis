import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeContext';

export default function SearchScreen() {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>Recherche</Text>
      </View>
    </SafeAreaView>
  );
}

