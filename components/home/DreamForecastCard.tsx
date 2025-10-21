import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useMoon } from '../../services/MoonService';
import { useTheme } from '../../services/ThemeService';
import { getDreamTypeLabel } from '../../utils/dreamForecastAlgorithm';

const DreamForecastCard: React.FC = () => {
  const router = useRouter();
  const { dreamForecast, loading } = useMoon();
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Helper function to render stars
  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  if (loading) {
    return (
      <View className="mx-6 mb-4 rounded-3xl p-6 shadow-sm" style={{ backgroundColor: colors.cardBackground }}>
        <Text className="text-center" style={{ color: colors.textSecondary }}>
          {t('forecast.loading')}
        </Text>
      </View>
    );
  }

  if (!dreamForecast) {
    return null;
  }

  const dreamTypeLabel = getDreamTypeLabel(dreamForecast.dreamType as any);

  return (
    <TouchableOpacity
      className="mx-6 mb-4 rounded-3xl p-6 shadow-sm"
      style={{ backgroundColor: colors.accentLight }}
      onPress={() => router.push('/(tabs)/forecast')}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>
            {t('forecast.prediction').toUpperCase()}
          </Text>
          <Text className="text-xl font-bold" style={{ color: colors.textPrimary }}>
            {dreamTypeLabel} {t('tabs.dreams')}
          </Text>
        </View>
        <Text className="text-3xl">🔮</Text>
      </View>

      {/* Preview metrics */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-1 mr-4">
          <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
            {t('forecast.intensity')}
          </Text>
          <Text className="text-base" style={{ color: colors.accent }}>
            {renderStars(dreamForecast.intensity)}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-medium mb-1" style={{ color: colors.textSecondary }}>
            {t('dreams.types.lucid')}
          </Text>
          <Text className="text-lg font-bold" style={{ color: colors.accent }}>
            {dreamForecast.lucidProbability}%
          </Text>
        </View>
      </View>

      {/* Moon phase indicator */}
      <View className="flex-row items-center justify-between pt-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        <View className="flex-row items-center">
          <Text className="text-xs mr-2" style={{ color: colors.textSecondary }}>
            🌙 {dreamForecast.moonPhase.text}
          </Text>
        </View>
        <Text className="text-xs font-semibold" style={{ color: colors.accent }}>
          {t('common.viewDetails')} →
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DreamForecastCard;

