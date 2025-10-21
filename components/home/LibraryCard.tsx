import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../services/ThemeService';

export default function LibraryCard() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View className="px-4 mb-4">
      <Pressable
        onPress={() => router.push('/library')}
        className="rounded-2xl p-6 active:opacity-90"
        style={{
          backgroundColor: colors.cardBackground,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View className="flex-row items-center mb-3">
          <View
            className="w-14 h-14 rounded-full items-center justify-center mr-4"
            style={{ backgroundColor: colors.accent + '20' }}
          >
            <Feather name="book-open" size={28} color={colors.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>
              Dream Library
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Learn about dreams & lucid dreaming
            </Text>
          </View>
          <Feather name="arrow-right" size={20} color={colors.textTertiary} />
        </View>
        
        <View className="flex-row items-center pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.gray200 }}>
          <View className="flex-row items-center mr-4">
            <Feather name="book" size={14} color={colors.textTertiary} style={{ marginRight: 4 }} />
            <Text className="text-xs" style={{ color: colors.textTertiary }}>
              Guides
            </Text>
          </View>
          <View className="flex-row items-center mr-4">
            <Feather name="target" size={14} color={colors.textTertiary} style={{ marginRight: 4 }} />
            <Text className="text-xs" style={{ color: colors.textTertiary }}>
              Techniques
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="compass" size={14} color={colors.textTertiary} style={{ marginRight: 4 }} />
            <Text className="text-xs" style={{ color: colors.textTertiary }}>
              Tips
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

