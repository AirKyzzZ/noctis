import React from 'react';
import { View, Text } from 'react-native';
import { DreamForecast } from '../../types/astronomy';
import { getDreamTypeLabel } from '../../utils/dreamForecastAlgorithm';
import { useTheme } from '../../services/ThemeService';

interface ForecastCardProps {
  forecast: DreamForecast;
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ forecast }) => {
  const { colors } = useTheme();
  const dreamTypeLabel = getDreamTypeLabel(forecast.dreamType as any);

  // Helper function to render stars
  const renderStars = (count: number) => {
    return '★'.repeat(count) + '☆'.repeat(5 - count);
  };

  return (
    <View className="rounded-3xl p-6 mb-4 shadow-sm" style={{ backgroundColor: colors.accentLight }}>
      <View className="mb-4">
        <Text className="text-sm font-semibold mb-1" style={{ color: colors.accent }}>
          TODAY'S PREDICTION
        </Text>
        <Text className="text-xl font-bold mb-3" style={{ color: colors.textPrimary }}>
          {dreamTypeLabel} Dream
        </Text>
        <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>
          {forecast.prediction}
        </Text>
      </View>

      <View className="pt-4 space-y-3" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        {/* Intensity */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Intensity
          </Text>
          <Text className="text-lg" style={{ color: colors.accent }}>
            {renderStars(forecast.intensity)}
          </Text>
        </View>

        {/* Clarity */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Clarity
          </Text>
          <Text className="text-lg" style={{ color: colors.accent }}>
            {renderStars(forecast.clarity)}
          </Text>
        </View>

        {/* Lucid Probability */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Lucidity Probability
          </Text>
          <View className="flex-row items-center">
            <View className="w-24 rounded-full h-2 mr-2" style={{ backgroundColor: colors.gray200 }}>
              <View 
                className="h-full rounded-full"
                style={{ 
                  width: `${forecast.lucidProbability}%`,
                  backgroundColor: colors.accent
                }}
              />
            </View>
            <Text className="text-sm font-semibold" style={{ color: colors.accent }}>
              {forecast.lucidProbability}%
            </Text>
          </View>
        </View>

        {/* Emotional Tone */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
            Emotional Tone
          </Text>
          <Text className="text-sm font-semibold capitalize" style={{ color: colors.accent }}>
            {forecast.emotionalTone}
          </Text>
        </View>
      </View>
    </View>
  );
};

