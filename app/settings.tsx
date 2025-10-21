import React from 'react';
import { View, Text, Pressable, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../services/ThemeService';
import { SettingsSection, SettingsItem, LanguageSelector } from '../components/settings';

const BUY_ME_COFFEE_URL = 'https://www.maximemansiet.fr/';

const APP_VERSION = '1.0.0';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();

  const handleBuyMeCoffee = async () => {
    try {
      const canOpen = await Linking.canOpenURL(BUY_ME_COFFEE_URL);
      if (canOpen) {
        await Linking.openURL(BUY_ME_COFFEE_URL);
      } else {
        Alert.alert('Error', 'Unable to open the link. Please try again later.');
      }
    } catch {
      Alert.alert('Error', 'Failed to open the link.');
    }
  };

  const settingsSections: { title: string; items: SettingsItem[] }[] = [
    {
      title: t('settings.appearance'),
      items: [
        {
          icon: 'moon',
          label: t('settings.theme'),
          type: 'toggle',
          value: isDark,
          onPress: toggleTheme,
        },
      ],
    },
    {
      title: t('settings.feedback'),
      items: [
        {
          icon: 'message-square',
          label: t('settings.feedback'),
          type: 'navigation',
          onPress: () => router.push('/feedback'),
        },
        {
          icon: 'coffee',
          label: t('settings.buyMeCoffee'),
          type: 'navigation',
          onPress: handleBuyMeCoffee,
        },
      ],
    },
    {
      title: t('settings.legal'),
      items: [
        {
          icon: 'file-text',
          label: t('settings.terms'),
          type: 'navigation',
          onPress: () => router.push('/legal/terms'),
        },
        {
          icon: 'shield',
          label: t('settings.privacy'),
          type: 'navigation',
          onPress: () => router.push('/legal/privacy'),
        },
      ],
    },
    {
      title: t('settings.general'),
      items: [
        {
          icon: 'info',
          label: t('settings.version'),
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
              {t('settings.title')}
            </Text>
          </View>

          {/* Language Selector */}
          <View className="mb-6">
            <Text
              className="text-sm font-semibold mb-3 uppercase"
              style={{ color: colors.textSecondary }}
            >
              {t('settings.language')}
            </Text>
            <View className="rounded-2xl overflow-hidden" style={{ backgroundColor: colors.gray100 }}>
              <LanguageSelector />
            </View>
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

