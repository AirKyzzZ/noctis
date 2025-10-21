import React, { useState, useEffect, createContext, useContext } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import i18n, { initializeI18n, changeLanguage as changeLanguageService, getCurrentLanguage } from './i18nService';

interface I18nContextType {
  currentLanguage: 'en' | 'fr';
  changeLanguage: (language: 'en' | 'fr') => Promise<void>;
}

const I18nContext = createContext<I18nContextType>({
  currentLanguage: 'en',
  changeLanguage: async () => {},
});

export const useI18n = () => useContext(I18nContext);

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'fr'>('en');

  useEffect(() => {
    initializeI18n().then(() => {
      setCurrentLanguage(getCurrentLanguage());
      setIsInitialized(true);
    });
  }, []);

  const changeLanguage = async (language: 'en' | 'fr') => {
    await changeLanguageService(language);
    setCurrentLanguage(language);
  };

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <I18nContext.Provider value={{ currentLanguage, changeLanguage }}>
        {children}
      </I18nContext.Provider>
    </I18nextProvider>
  );
}

