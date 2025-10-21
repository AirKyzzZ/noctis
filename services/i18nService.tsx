import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import fr from '../locales/fr.json';

const LANGUAGE_STORAGE_KEY = '@noctis_language';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
};

const getStoredLanguage = async (): Promise<string> => {
  try {
    const storedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'fr')) {
      return storedLanguage;
    }
  } catch (error) {
    console.error('Error getting stored language:', error);
  }
  
  // Default to English, or device language if it's French
  const deviceLanguage = Localization.getLocales()[0]?.languageCode;
  return deviceLanguage === 'fr' ? 'fr' : 'en';
};

export const initializeI18n = async () => {
  const language = await getStoredLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: language,
      fallbackLng: 'en',
      compatibilityJSON: 'v3',
      interpolation: {
        escapeValue: false,
      },
    });

  return i18n;
};

export const changeLanguage = async (language: 'en' | 'fr') => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    await i18n.changeLanguage(language);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export const getCurrentLanguage = (): 'en' | 'fr' => {
  return (i18n.language as 'en' | 'fr') || 'en';
};

export const getAvailableLanguages = () => {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
  ];
};

export default i18n;

