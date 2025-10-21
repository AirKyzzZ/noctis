import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../services/ThemeService';

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const sections = [
    {
      title: 'Acceptance of Terms',
      content:
        'By downloading, installing, or using the Noctis app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the app.',
    },
    {
      title: 'Description of Service',
      content:
        'Noctis is a dream journaling application that allows users to record, track, and analyze their dreams. The app stores all data locally on your device and does not sync or upload data to external servers.',
    },
    {
      title: 'User Data and Privacy',
      content:
        'All dream entries, personal information, and app data are stored locally on your device. We do not collect, transmit, or store any of your personal data on our servers. You are responsible for backing up your own data.',
    },
    {
      title: 'User Responsibilities',
      content:
        'You agree to use the app only for lawful purposes and in a way that does not infringe the rights of others. You are responsible for maintaining the confidentiality of your device and any data stored in the app.',
    },
    {
      title: 'Intellectual Property',
      content:
        'The Noctis app, including all content, features, and functionality, is owned by the app creators and is protected by international copyright, trademark, and other intellectual property laws.',
    },
    {
      title: 'Disclaimer of Warranties',
      content:
        'The app is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the app will be uninterrupted, error-free, or free of viruses or other harmful components.',
    },
    {
      title: 'Limitation of Liability',
      content:
        'In no event shall Noctis or its creators be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the app.',
    },
    {
      title: 'Changes to Terms',
      content:
        'We reserve the right to modify these Terms of Service at any time. We will notify users of any changes by updating the date at the top of this document. Your continued use of the app constitutes acceptance of any changes.',
    },
    {
      title: 'Termination',
      content:
        'We reserve the right to terminate or suspend your access to the app at any time, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users or the app.',
    },
    {
      title: 'Contact Information',
      content:
        'If you have any questions about these Terms of Service, please contact us at support@noctis.app',
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
              Terms of Service
            </Text>
          </View>

          {/* Last Updated */}
          <Text className="text-sm mb-6" style={{ color: colors.textTertiary }}>
            Last Updated: October 21, 2025
          </Text>

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
              By using Noctis, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

