import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';

export interface SettingsItem {
  icon: string;
  label: string;
  type: 'toggle' | 'navigation' | 'info';
  value?: boolean | string;
  onPress?: () => void;
}

interface SettingsSectionProps {
  title: string;
  items: SettingsItem[];
}

export function SettingsSection({ title, items }: SettingsSectionProps) {
  const { colors } = useTheme();

  return (
    <View className="mb-6">
      <Text
        className="text-sm font-semibold mb-3 uppercase"
        style={{ color: colors.textSecondary }}
      >
        {title}
      </Text>
      <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.gray100 }}>
        {items.map((item, itemIndex) => (
          <View key={itemIndex}>
            <Pressable
              onPress={item.type !== 'info' ? item.onPress : undefined}
              disabled={item.type === 'info'}
              className={`flex-row items-center justify-between px-4 py-4 ${
                item.type !== 'info' ? 'active:opacity-70' : ''
              }`}
            >
              <View className="flex-row items-center flex-1">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: colors.background }}
                >
                  <Feather name={item.icon as any} size={16} color={colors.accent} />
                </View>
                <Text className="text-base flex-1" style={{ color: colors.textPrimary }}>
                  {item.label}
                </Text>
              </View>
              {item.type === 'toggle' && (
                <View
                  className="w-12 h-7 rounded-full p-1"
                  style={{
                    backgroundColor: item.value ? colors.accent : colors.gray200,
                  }}
                >
                  <View
                    className="w-5 h-5 rounded-full bg-white"
                    style={{
                      transform: [{ translateX: item.value ? 20 : 0 }],
                    }}
                  />
                </View>
              )}
              {item.type === 'navigation' && (
                <Feather name="chevron-right" size={20} color={colors.textTertiary} />
              )}
              {item.type === 'info' && (
                <Text className="text-base" style={{ color: colors.textSecondary }}>
                  {item.value}
                </Text>
              )}
            </Pressable>
            {itemIndex < items.length - 1 && (
              <View className="h-px ml-14" style={{ backgroundColor: colors.gray200 }} />
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

