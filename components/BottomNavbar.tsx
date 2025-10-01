import React from 'react';
import { View, Pressable, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

type FeatherIconName = keyof typeof Feather.glyphMap;

export type BottomTabItem = {
  key: string;
  icon: FeatherIconName;
  label?: string;
};

type BottomNavbarProps = {
  tabs: BottomTabItem[];
  activeKey: string;
  onTabPress?: (key: string) => void;
};

export default function BottomNavbar(props: BottomNavbarProps) {
  const { tabs, activeKey, onTabPress } = props;
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  const containerPaddingBottom = Math.max(insets.bottom, 8);
  const isDark = colorScheme === 'dark';
  const containerBgColor = isDark ? '#FFFFFF' : '#000000';
  const inactiveIconColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-0 right-0"
      style={{ bottom: 0, paddingBottom: containerPaddingBottom }}
    >
      <View className="px-5">
        <View
          className="mx-auto w-full rounded-full"
          style={{
            maxWidth: 520,
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: containerBgColor,
            shadowColor: '#000',
            shadowOpacity: colorScheme === 'dark' ? 0.55 : 0.15,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            elevation: 14,
          }}
        >
          <View className="flex-row items-center justify-between">
            {tabs.map((tab) => {
              const isActive = tab.key === activeKey;
              const circleFillColor = isActive ? (isDark ? '#000000' : '#FFFFFF') : 'transparent';
              const iconColor = isActive ? (isDark ? '#FFFFFF' : '#000000') : inactiveIconColor;

              return (
                <Pressable
                  key={tab.key}
                  accessibilityRole="button"
                  accessibilityLabel={tab.label ?? tab.key}
                  onPress={() => onTabPress?.(tab.key)}
                  hitSlop={12}
                  className="items-center justify-center rounded-full"
                  style={{ width: 56, height: 40 }}
                >
                  <View
                    className="items-center justify-center rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: circleFillColor,
                    }}
                  >
                    <Feather name={tab.icon} size={24} color={iconColor} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}


