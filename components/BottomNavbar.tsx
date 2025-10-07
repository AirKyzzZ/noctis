import React from 'react';
import { View, Pressable, Animated, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeContext';

type FeatherIconName = keyof typeof Feather.glyphMap;

export type BottomTabItem = {
  key: string;
  icon: FeatherIconName;
  label?: string;
  badge?: number;
};

type BottomNavbarProps = {
  tabs: BottomTabItem[];
  activeKey: string;
  onTabPress?: (key: string) => void;
};

export default function BottomNavbar(props: BottomNavbarProps) {
  const { tabs, activeKey, onTabPress } = props;
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const containerPaddingBottom = Math.max(insets.bottom, 8);
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
            shadowOpacity: isDark ? 0.55 : 0.15,
            shadowOffset: { width: 0, height: 8 },
            shadowRadius: 20,
            elevation: 14,
          }}
        >
          <View className="flex-row items-center justify-between">
            {tabs.map((tab) => {
              const isActive = tab.key === activeKey;
              return (
                <TabButton
                  key={tab.key}
                  tab={tab}
                  isActive={isActive}
                  isDark={isDark}
                  inactiveIconColor={inactiveIconColor}
                  onPress={() => onTabPress?.(tab.key)}
                />
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

type TabButtonProps = {
  tab: BottomTabItem;
  isActive: boolean;
  isDark: boolean;
  inactiveIconColor: string;
  onPress: () => void;
};

function TabButton({ tab, isActive, isDark, inactiveIconColor, onPress }: TabButtonProps) {
  const scale = React.useRef(new Animated.Value(isActive ? 1 : 0.98)).current;

  React.useEffect(() => {
    if (isActive) {
      Animated.sequence([
        Animated.spring(scale, {
          toValue: 1.15,
          useNativeDriver: true,
          friction: 5,
          tension: 140,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 7,
          tension: 130,
        }),
      ]).start();
    } else {
      Animated.spring(scale, {
        toValue: 0.98,
        useNativeDriver: true,
        friction: 7,
        tension: 130,
      }).start();
    }
  }, [isActive, scale]);

  const circleFillColor = isActive ? (isDark ? '#000000' : '#FFFFFF') : 'transparent';
  const iconColor = isActive ? (isDark ? '#FFFFFF' : '#000000') : inactiveIconColor;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={tab.label ?? tab.key}
      onPress={onPress}
      hitSlop={12}
      className="items-center justify-center rounded-full"
      style={{ width: 56, height: 40 }}
    >
      <Animated.View
        className="items-center justify-center rounded-full"
        style={{
          width: 40,
          height: 40,
          backgroundColor: circleFillColor,
          transform: [{ scale }],
        }}
      >
        <Feather name={tab.icon} size={24} color={iconColor} />
        {tab.badge !== undefined && tab.badge > 0 && (
          <View
            className="absolute -top-1 -right-1 rounded-full items-center justify-center"
            style={{
              backgroundColor: '#EF4444',
              minWidth: 18,
              height: 18,
              paddingHorizontal: 4,
            }}
          >
            <Text
              className="font-bold"
              style={{
                color: '#FFFFFF',
                fontSize: 10,
              }}
            >
              {tab.badge > 99 ? '99+' : tab.badge}
            </Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}


