import React from 'react';
import { View, Text } from 'react-native';
import { MoonPhase } from '../../types/astronomy';
import { getMoonPhaseEmoji } from '../../utils/dreamForecastAlgorithm';
import { useTheme } from '../../providers/ThemeContext';

interface MoonPhaseCardProps {
  moonPhase: MoonPhase;
  moonFraction: number;
}

export const MoonPhaseCard: React.FC<MoonPhaseCardProps> = ({ moonPhase, moonFraction }) => {
  const { colors } = useTheme();
  const moonEmoji = getMoonPhaseEmoji(moonPhase.value);
  const illuminationPercent = Math.round(moonFraction * 100);

  return (
    <View className="rounded-3xl p-6 mb-4 shadow-sm" style={{ backgroundColor: colors.cardBackground }}>
      <View className="items-center">
        <Text className="text-6xl mb-3" style={{ lineHeight: 80 }}>{moonEmoji}</Text>
        <Text className="text-2xl font-bold mb-1" style={{ color: colors.textPrimary }}>
          {moonPhase.text}
        </Text>
        <Text className="text-lg mb-4" style={{ color: colors.textSecondary }}>
          {illuminationPercent}% illuminated
        </Text>
        <View className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: colors.gray200 }}>
          <View 
            className="h-full rounded-full"
            style={{ 
              width: `${illuminationPercent}%`,
              backgroundColor: colors.accent
            }}
          />
        </View>
      </View>
    </View>
  );
};

