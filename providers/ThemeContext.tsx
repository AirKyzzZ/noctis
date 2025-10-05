import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
  isTransitioning: boolean;
  colors: {
    background: string;
    foreground: string;
    cardBackground: string;
    border: string;
    textPrimary: string;
    textSecondary: string;
    textTertiary: string;
    accent: string;
    accentLight: string;
    inputBackground: string;
    gray100: string;
    gray200: string;
    gray300: string;
    gray500: string;
    gray600: string;
    gray700: string;
    gray900: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const lightColors = {
  background: '#FFFFFF',
  foreground: '#000000',
  cardBackground: '#FFFFFF',
  border: '#D1D5DB',
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  accent: '#8B5CF6',
  accentLight: '#F3E8FF',
  inputBackground: '#F3F4F6',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray500: '#9CA3AF',
  gray600: '#6B7280',
  gray700: '#374151',
  gray900: '#1F2937',
};

const darkColors = {
  background: '#000000',
  foreground: '#FFFFFF',
  cardBackground: '#1F1F1F',
  border: '#374151',
  textPrimary: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  accent: '#8B5CF6',
  accentLight: '#2D1B4E',
  inputBackground: '#1F1F1F',
  gray100: '#1F1F1F',
  gray200: '#2D2D2D',
  gray300: '#3D3D3D',
  gray500: '#6B7280',
  gray600: '#9CA3AF',
  gray700: '#D1D5DB',
  gray900: '#F9FAFB',
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('@theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
  };

  const toggleTheme = async () => {
    // Start transition animation
    setIsTransitioning(true);

    // Wait a brief moment for the overlay to appear
    setTimeout(() => {
      // Configure smooth animation
      LayoutAnimation.configureNext(
        LayoutAnimation.create(
          300, // duration
          LayoutAnimation.Types.easeInEaseOut,
          LayoutAnimation.Properties.opacity
        )
      );

      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      
      // End transition after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);

      // Save theme
      AsyncStorage.setItem('@theme', newTheme).catch((error) => {
        console.error('Failed to save theme:', error);
      });
    }, 150);
  };

  const colors = theme === 'light' ? lightColors : darkColors;
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark, isTransitioning, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

