import React, { useState } from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeService';
import { useI18n } from '../../services/I18nProvider';
import { getAvailableLanguages } from '../../services/i18nService';

export function LanguageSelector() {
  const { colors } = useTheme();
  const { currentLanguage, changeLanguage } = useI18n();
  const [showModal, setShowModal] = useState(false);
  const languages = getAvailableLanguages();

  const currentLanguageName = languages.find(lang => lang.code === currentLanguage)?.nativeName || 'English';

  const handleLanguageSelect = async (languageCode: 'en' | 'fr') => {
    await changeLanguage(languageCode);
    setShowModal(false);
  };

  return (
    <>
      <Pressable
        onPress={() => setShowModal(true)}
        className="flex-row items-center justify-between px-4 py-4 active:opacity-70"
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-8 h-8 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: colors.background }}
          >
            <Feather name="globe" size={16} color={colors.accent} />
          </View>
          <View className="flex-1">
            <Text className="text-base" style={{ color: colors.textPrimary }}>
              Language
            </Text>
            <Text className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>
              {currentLanguageName}
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={20} color={colors.textTertiary} />
      </Pressable>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <Pressable className="flex-1" onPress={() => setShowModal(false)} />
          <View
            className="rounded-t-3xl px-6 py-6"
            style={{ backgroundColor: colors.background, maxHeight: '50%' }}
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                Select Language
              </Text>
              <Pressable onPress={() => setShowModal(false)} hitSlop={12}>
                <Feather name="x" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {languages.map((language) => (
                <Pressable
                  key={language.code}
                  onPress={() => handleLanguageSelect(language.code as 'en' | 'fr')}
                  className="flex-row items-center justify-between py-4 px-4 rounded-xl mb-2 active:opacity-70"
                  style={{
                    backgroundColor: currentLanguage === language.code ? colors.accent + '20' : colors.cardBackground,
                  }}
                >
                  <View>
                    <Text
                      className="text-base font-semibold"
                      style={{ color: colors.textPrimary }}
                    >
                      {language.nativeName}
                    </Text>
                    <Text className="text-sm mt-0.5" style={{ color: colors.textSecondary }}>
                      {language.name}
                    </Text>
                  </View>
                  {currentLanguage === language.code && (
                    <Feather name="check" size={20} color={colors.accent} />
                  )}
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

