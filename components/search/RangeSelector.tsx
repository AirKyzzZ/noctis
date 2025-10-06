import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../../providers/ThemeContext';

interface RangeSelectorProps {
  currentMin: number;
  currentMax: number;
  onMinChange: (val: number) => void;
  onMaxChange: (val: number) => void;
}

export default function RangeSelector({ currentMin, currentMax, onMinChange, onMaxChange }: RangeSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <Text className="mb-2 text-xs" style={{ color: colors.textSecondary }}>Min</Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map(val => (
              <Pressable
                key={val}
                onPress={() => onMinChange(val)}
                className="mr-2 items-center justify-center rounded-lg"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: val <= currentMin ? colors.accent : colors.gray100,
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: val <= currentMin ? '#FFFFFF' : colors.textSecondary }}
                >
                  {val}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View className="flex-1">
          <Text className="mb-2 text-xs" style={{ color: colors.textSecondary }}>Max</Text>
          <View className="flex-row">
            {[1, 2, 3, 4, 5].map(val => (
              <Pressable
                key={val}
                onPress={() => onMaxChange(val)}
                className="mr-2 items-center justify-center rounded-lg"
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: val >= currentMax ? colors.accent : colors.gray100,
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: val >= currentMax ? '#FFFFFF' : colors.textSecondary }}
                >
                  {val}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

