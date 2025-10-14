import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Dream } from '../../types/dream';
import { format } from '../../../noctis/utils/dateFormat';
import { useTheme } from '../../services/ThemeService';

interface DreamCardProps {
  dream: Dream;
  onPress: () => void;
  onDelete?: () => void;
}

const dreamTypeColors = {
  ordinary: '#6B7280',
  lucid: '#8B5CF6',
  nightmare: '#EF4444',
  recurring: '#F59E0B',
  prophetic: '#10B981',
  healing: '#3B82F6',
};

const dreamTypeIcons: Record<string, keyof typeof Feather.glyphMap> = {
  ordinary: 'moon',
  lucid: 'star',
  nightmare: 'alert-circle',
  recurring: 'rotate-cw',
  prophetic: 'eye',
  healing: 'heart',
};

const toneEmojis = {
  positive: '😊',
  negative: '😔',
  neutral: '😐',
  mixed: '🤔',
};

export default function DreamCard({ dream, onPress, onDelete }: DreamCardProps) {
  const { colors } = useTheme();
  const typeColor = dreamTypeColors[dream.type];
  const typeIcon = dreamTypeIcons[dream.type];
  const toneEmoji = toneEmojis[dream.overallTone];

  return (
    <Pressable
      onPress={onPress}
      className="mb-3 overflow-hidden rounded-2xl"
      style={{
        backgroundColor: colors.cardBackground,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Top color bar */}
      <View className="h-1.5" style={{ backgroundColor: typeColor }} />

      <View className="p-4">
        {/* Header */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1">
            <View className="mb-1 flex-row items-center">
              <View
                className="mr-2 items-center justify-center rounded-full"
                style={{ width: 32, height: 32, backgroundColor: `${typeColor}20` }}
              >
                <Feather name={typeIcon} size={16} color={typeColor} />
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold capitalize" style={{ color: colors.textPrimary }}>
                  {dream.type} Dream
                </Text>
                <Text className="text-xs" style={{ color: colors.textTertiary }}>
                  {format(new Date(dream.dateTime), 'MMM dd, yyyy • hh:mm a')}
                </Text>
              </View>
            </View>
          </View>

          {onDelete && (
            <Pressable
              onPress={onDelete}
              hitSlop={8}
              className="ml-2 items-center justify-center rounded-full"
              style={{ width: 32, height: 32 }}
            >
              <Feather name="trash-2" size={16} color="#EF4444" />
            </Pressable>
          )}
        </View>

        {/* Description preview */}
        <Text
          numberOfLines={2}
          className="mb-3 text-sm leading-5"
          style={{ color: colors.textSecondary }}
        >
          {dream.description || 'No description provided'}
        </Text>

        {/* Tags */}
        {dream.tags.length > 0 && (
          <View className="mb-3 flex-row flex-wrap">
            {dream.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                className="mb-1 mr-2 rounded-full px-3 py-1"
                style={{ backgroundColor: colors.gray100 }}
              >
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {tag}
                </Text>
              </View>
            ))}
            {dream.tags.length > 3 && (
              <View
                className="mb-1 rounded-full px-3 py-1"
                style={{ backgroundColor: colors.gray100 }}
              >
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  +{dream.tags.length - 3}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Footer stats */}
        <View className="flex-row items-center justify-between border-t pt-3" style={{ borderTopColor: colors.border }}>
          <View className="flex-row items-center">
            <Feather name="moon" size={14} color={colors.textTertiary} />
            <Text className="ml-1.5 text-xs" style={{ color: colors.textSecondary }}>
              Quality: {dream.sleepQuality}/5
            </Text>
          </View>

          <View className="flex-row items-center">
            <Feather name="eye" size={14} color={colors.textTertiary} />
            <Text className="ml-1.5 text-xs" style={{ color: colors.textSecondary }}>
              Clarity: {dream.clarity}/5
            </Text>
          </View>

          <View className="flex-row items-center">
            <Text className="text-sm">{toneEmoji}</Text>
            <Text className="ml-1 text-xs capitalize" style={{ color: colors.textSecondary }}>
              {dream.overallTone}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

