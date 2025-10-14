import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../../services/ThemeService';

interface RequestCounterProps {
  used: number;
  remaining: number;
  total?: number;
}

export const RequestCounter: React.FC<RequestCounterProps> = ({ 
  used, 
  remaining, 
  total = 10 
}) => {
  const { colors, isDark } = useTheme();
  const percentage = (used / total) * 100;
  const isLow = remaining <= 2;
  const isOut = remaining === 0;

  const statusColor = isOut ? '#DC2626' : isLow ? '#F59E0B' : '#10B981';

  return (
    <View className="rounded-2xl p-4 mb-4 shadow-sm" style={{ backgroundColor: colors.cardBackground }}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
          API Requests Today
        </Text>
        <Text className="text-sm font-bold" style={{ color: statusColor }}>
          {remaining} remaining
        </Text>
      </View>
      
      <View className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: colors.gray200 }}>
        <View 
          className="h-full rounded-full"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: statusColor
          }}
        />
      </View>
      
      <Text className="text-xs mt-1" style={{ color: colors.textTertiary }}>
        {used} / {total} used
      </Text>

      {isOut && (
        <View className="mt-2 rounded-lg p-2" style={{ backgroundColor: isDark ? '#3D1A1A' : '#FEE2E2' }}>
          <Text className="text-xs" style={{ color: '#DC2626' }}>
            Daily limit reached. Cached data will be used.
          </Text>
        </View>
      )}
    </View>
  );
};

