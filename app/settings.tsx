import React from 'react';
import { View, Text, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../services/ThemeService';
import { SettingsSection, SettingsItem } from '../components/settings';

const BUY_ME_COFFEE_URL = 'https://www.maximemansiet.fr/';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const handleBuyMeCoffee = async () => {
    try {
      const canOpen = await Linking.canOpenURL(BUY_ME_COFFEE_URL);
      if (canOpen) {
        await Linking.openURL(BUY_ME_COFFEE_URL);
      } else {
        Alert.alert('Error', 'Unable to open the link. Please try again later.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the link.');
    }
  };

  const settingsSections: Array<{ title: string; items: SettingsItem[] }> = [
    {
      title: 'Appearance',
      items: [
        {
          icon: 'moon',
          label: 'Dark Mode',
          type: 'toggle',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: 'Feedback & Support',
      items: [
        {
          icon: 'message-square',
          label: 'Send Feedback',
          type: 'navigation',
          onPress: () => router.push('/feedback'),
        },
        {
          icon: 'coffee',
          label: 'Buy Me a Coffee',
          type: 'navigation',
          onPress: handleBuyMeCoffee,
        },
      ],
    },
    {
      title: 'Legal',
      items: [
        {
          icon: 'file-text',
          label: 'Terms of Service',
          type: 'navigation',
          onPress: () => router.push('/legal/terms'),
        },
        {
          icon: 'shield',
          label: 'Privacy Policy',
          type: 'navigation',
          onPress: () => router.push('/legal/privacy'),
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          icon: 'info',
          label: 'Version',
          type: 'info',
          value: APP_VERSION,
        },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-6">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <Pressable onPress={() => router.back()} className="mr-4 active:opacity-70">
              <Feather name="arrow-left" size={24} color={colors.textPrimary} />
            </Pressable>
            <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
              Settings
            </Text>
          </View>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <SettingsSection
              key={sectionIndex}
              title={section.title}
              items={section.items}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

