import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../services/ThemeService';

export default function PrivacyPolicyScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const sections = [
    {
      title: 'Introduction',
      content:
        'Welcome to Noctis. We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we handle your information when you use our dream journaling app.',
    },
    {
      title: 'Data Collection',
      content:
        'Noctis is designed with privacy as a core principle. We do NOT collect, transmit, or store any of your personal data on external servers. All data you enter into the app (including dream entries, personal information, and preferences) is stored locally on your device only.',
    },
    {
      title: 'Local Data Storage',
      content:
        'All information you provide to Noctis is stored locally on your device using secure storage mechanisms. This includes:\n\n• Dream journal entries\n• Personal profile information\n• App settings and preferences\n• Images and media you add to your dreams\n• Statistics and analytics data',
    },
    {
      title: 'Data Access',
      content:
        'Only you have access to your data stored in the Noctis app. We do not have access to view, modify, or retrieve any of your stored information. Your data never leaves your device unless you explicitly choose to export it.',
    },
    {
      title: 'Third-Party Services',
      content:
        'Noctis may use third-party services for non-personal functionality such as:\n\n• Moon phase data (accessed anonymously)\n• App analytics (if enabled, anonymized only)\n\nThese services do not have access to your personal dream entries or profile information.',
    },
    {
      title: 'Data Export and Sharing',
      content:
        'You have full control over your data. You can export your dreams and data at any time through the app\'s export feature. Any sharing of your data is entirely voluntary and under your control.',
    },
    {
      title: 'Data Security',
      content:
        'We take reasonable measures to protect your data stored locally on your device. However, please note that no method of electronic storage is 100% secure. We recommend keeping your device secure with appropriate passwords or biometric locks.',
    },
    {
      title: 'Data Deletion',
      content:
        'You can delete your data at any time by:\n\n• Deleting individual dream entries within the app\n• Clearing all app data through your device settings\n• Uninstalling the app (this will remove all local data)',
    },
    {
      title: 'Children\'s Privacy',
      content:
        'Noctis is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided data to the app, please contact us.',
    },
    {
      title: 'Changes to Privacy Policy',
      content:
        'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.',
    },
    {
      title: 'Your Rights',
      content:
        'Since all data is stored locally on your device, you have complete control over your information. You have the right to:\n\n• Access your data at any time\n• Export your data in various formats\n• Delete your data permanently\n• Control what information you provide',
    },
    {
      title: 'Contact Us',
      content:
        'If you have any questions about this Privacy Policy or our data practices, please contact us at:\n\nEmail: support@noctis.app',
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
            <Text className="text-3xl font-bold flex-1" style={{ color: colors.textPrimary }}>
              Privacy Policy
            </Text>
          </View>

          {/* Last Updated */}
          <Text className="text-sm mb-6" style={{ color: colors.textTertiary }}>
            Last Updated: October 21, 2025
          </Text>

          {/* Highlight Box */}
          <View
            className="p-4 rounded-xl mb-6"
            style={{ backgroundColor: colors.accent + '20' }}
          >
            <View className="flex-row items-start">
              <Feather name="shield" size={20} color={colors.accent} style={{ marginRight: 10, marginTop: 2 }} />
              <Text className="text-sm leading-5 flex-1" style={{ color: colors.textPrimary }}>
                <Text className="font-bold">Privacy First:</Text> Noctis stores all your data locally on your device. We never upload, sync, or access your personal information.
              </Text>
            </View>
          </View>

          {/* Content */}
          {sections.map((section, index) => (
            <View key={index} className="mb-6">
              <Text className="text-lg font-bold mb-2" style={{ color: colors.textPrimary }}>
                {index + 1}. {section.title}
              </Text>
              <Text className="text-base leading-6" style={{ color: colors.textSecondary }}>
                {section.content}
              </Text>
            </View>
          ))}

          {/* Footer */}
          <View
            className="p-4 rounded-xl mb-8"
            style={{ backgroundColor: colors.gray100 }}
          >
            <Text className="text-sm leading-5" style={{ color: colors.textSecondary }}>
              By using Noctis, you acknowledge that you have read and understood this Privacy Policy.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

