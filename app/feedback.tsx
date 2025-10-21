import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../services/ThemeService';

type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<FeedbackType>('bug');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: 'bug' as const, label: 'Bug Report', icon: 'alert-circle' },
    { id: 'feature' as const, label: 'Feature Request', icon: 'star' },
    { id: 'improvement' as const, label: 'Improvement', icon: 'trending-up' },
    { id: 'other' as const, label: 'Other', icon: 'message-circle' },
  ];

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert('Missing Information', 'Please fill in both subject and message fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      // For now, we'll open an email client with pre-filled information
      // In a production app, you might want to integrate with a backend API
      const emailSubject = `[${selectedType.toUpperCase()}] ${subject}`;
      const emailBody = `Feedback Type: ${selectedType}\n\nMessage:\n${message}\n\n---\nUser Email: ${email || 'Not provided'}`;
      const mailtoUrl = `mailto:support@noctis.app?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (canOpen) {
        await Linking.openURL(mailtoUrl);
        Alert.alert(
          'Feedback Sent',
          'Thank you for your feedback! Your default email client has been opened.',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Email Client Not Available',
          'Please email us directly at support@noctis.app'
        );
      }
    } catch {
      Alert.alert('Error', 'Failed to send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="flex-1 px-6 py-6">
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <Pressable onPress={() => router.back()} className="mr-4 active:opacity-70">
                <Feather name="arrow-left" size={24} color={colors.textPrimary} />
              </Pressable>
              <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>
                Send Feedback
              </Text>
            </View>

            {/* Description */}
            <Text className="text-base mb-6" style={{ color: colors.textSecondary }}>
              We'd love to hear from you! Share your thoughts, report bugs, or suggest new features.
            </Text>

            {/* Feedback Type */}
            <View className="mb-6">
              <Text className="text-sm font-semibold mb-3" style={{ color: colors.textSecondary }}>
                Feedback Type
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {feedbackTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    onPress={() => setSelectedType(type.id)}
                    className="flex-row items-center px-4 py-3 rounded-xl active:opacity-70"
                    style={{
                      backgroundColor:
                        selectedType === type.id ? colors.accent : colors.gray100,
                    }}
                  >
                    <Feather
                      name={type.icon as any}
                      size={16}
                      color={selectedType === type.id ? '#FFFFFF' : colors.textPrimary}
                      style={{ marginRight: 6 }}
                    />
                    <Text
                      className="text-sm font-semibold"
                      style={{
                        color: selectedType === type.id ? '#FFFFFF' : colors.textPrimary,
                      }}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Email (Optional) */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                Email (Optional)
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.textTertiary}
                keyboardType="email-address"
                autoCapitalize="none"
                className="px-4 py-4 rounded-xl"
                style={{ backgroundColor: colors.inputBackground, color: colors.textPrimary }}
              />
              <Text className="text-xs mt-1" style={{ color: colors.textTertiary }}>
                Provide your email if you'd like us to follow up
              </Text>
            </View>

            {/* Subject */}
            <View className="mb-4">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                Subject *
              </Text>
              <TextInput
                value={subject}
                onChangeText={setSubject}
                placeholder="Brief summary of your feedback"
                placeholderTextColor={colors.textTertiary}
                className="px-4 py-4 rounded-xl"
                style={{ backgroundColor: colors.inputBackground, color: colors.textPrimary }}
              />
            </View>

            {/* Message */}
            <View className="mb-6">
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>
                Message *
              </Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Tell us more about your feedback..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={8}
                textAlignVertical="top"
                className="px-4 py-4 rounded-xl"
                style={{
                  backgroundColor: colors.inputBackground,
                  color: colors.textPrimary,
                  minHeight: 150,
                }}
              />
            </View>

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
              disabled={isSubmitting}
              className="bg-accent py-4 rounded-xl active:opacity-80 mb-8"
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Submit Feedback</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

