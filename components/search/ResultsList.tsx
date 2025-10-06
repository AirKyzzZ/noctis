import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../providers/ThemeContext';
import { Dream } from '../../types/dream';
import DreamCard from '../dreams/DreamCard';

interface ResultsListProps {
  dreams: Dream[];
}

export default function ResultsList({ dreams }: ResultsListProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1">
      <View className="border-b px-4 py-3" style={{ borderBottomColor: colors.border }}>
        <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
          {dreams.length} {dreams.length === 1 ? 'dream' : 'dreams'} found
        </Text>
      </View>
      <FlatList
        data={dreams}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <DreamCard
            dream={item}
            onPress={() => router.push(`/dreams/${item.id}?from=search`)}
          />
        )}
      />
    </View>
  );
}

