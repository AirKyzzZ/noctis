import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useDreams } from '../../providers/DreamContext';
import { useTheme } from '../../providers/ThemeContext';
import { DreamCard, StreakBanner, StatsGrid, DreamKiviatChartAggregate } from '../../components/dreams';

export default function DreamsScreen() {
  const router = useRouter();
  const { dreams, stats, loading, deleteDream } = useDreams();
  const { colors } = useTheme();
  const [sortBy, setSortBy] = useState<'date' | 'type'>('date');

  const handleDeleteDream = (id: string) => {
    Alert.alert(
      'Delete Dream',
      'Are you sure you want to delete this dream entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDream(id),
        },
      ]
    );
  };

  const sortedDreams = [...dreams].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime();
    }
    return a.type.localeCompare(b.type);
  });

  if (loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <Text style={{ color: colors.textSecondary }}>Loading your dreams...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="mb-4 px-4 pt-2">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
              💤 Dream Journal
            </Text>
            <Text className="mt-0.5 text-sm" style={{ color: colors.textTertiary }}>
              Track and explore your dreams
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/dreams/add')}
            className="items-center justify-center rounded-full"
            style={{
              width: 48,
              height: 48,
              backgroundColor: colors.accent,
              shadowColor: colors.accent,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <Feather name="plus" size={24} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Streak Banner */}
        <StreakBanner currentStreak={stats.currentStreak} longestStreak={stats.longestStreak} />

        {/* Stats Grid */}
        {dreams.length > 0 && <StatsGrid stats={stats} />}

        {/* Kiviat Chart - Overall Statistics */}
        {dreams.length > 0 && <DreamKiviatChartAggregate dreams={dreams} />}

        {/* Sort Options */}
        {dreams.length > 0 && (
          <View className="mb-3 flex-row items-center px-4">
            <Text className="mr-3 text-sm" style={{ color: colors.textSecondary }}>
              Sort by:
            </Text>
            <Pressable
              onPress={() => setSortBy('date')}
              className="mr-2 rounded-full px-4 py-2"
              style={{
                backgroundColor: sortBy === 'date' ? colors.accent : colors.gray100,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: sortBy === 'date' ? '#FFFFFF' : colors.textSecondary }}
              >
                Date
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setSortBy('type')}
              className="rounded-full px-4 py-2"
              style={{
                backgroundColor: sortBy === 'type' ? colors.accent : colors.gray100,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{ color: sortBy === 'type' ? '#FFFFFF' : colors.textSecondary }}
              >
                Type
              </Text>
            </Pressable>
          </View>
        )}

        {/* Dreams List */}
        <View className="px-4 pb-32">
          {dreams.length === 0 ? (
            <View className="mt-16 items-center justify-center px-8">
              <View
                className="mb-4 items-center justify-center rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: colors.gray100,
                }}
              >
                <Feather name="moon" size={36} color={colors.textTertiary} />
              </View>
              <Text className="mb-2 text-center text-lg font-bold" style={{ color: colors.textPrimary }}>
                No dreams yet
              </Text>
              <Text className="mb-6 text-center text-sm" style={{ color: colors.textSecondary }}>
                Start your dream journaling journey by recording your first dream
              </Text>
              <Pressable
                onPress={() => router.push('/dreams/add')}
                className="rounded-full px-6 py-3"
                style={{ backgroundColor: colors.accent }}
              >
                <Text className="font-semibold text-white">Add Your First Dream</Text>
              </Pressable>
            </View>
          ) : (
            sortedDreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onPress={() => router.push(`/dreams/${dream.id}?from=dreams`)}
                onDelete={() => handleDeleteDream(dream.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

