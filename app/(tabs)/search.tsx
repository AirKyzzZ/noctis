import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../services/ThemeService';
import { SearchContainer } from '../../components/search';

export default function SearchScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <SearchContainer />
    </SafeAreaView>
  );
}

