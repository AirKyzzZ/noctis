import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  showConfetti: boolean;
  enterApp: () => Promise<void>;
  exitApp: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  showConfetti: false,
  enterApp: async () => {},
  exitApp: async () => {},
});

export const useAuth = () => useContext(AuthContext);

const AUTH_STORAGE_KEY = '@noctis_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(authValue === 'true');
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const enterApp = async () => {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true');
      setShowConfetti(true);
      setIsAuthenticated(true);
      
      // Hide confetti after animation completes
      setTimeout(() => {
        setShowConfetti(false);
      }, 8000);
    } catch (error) {
      console.error('Error entering app:', error);
    }
  };

  const exitApp = async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error exiting app:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, showConfetti, enterApp, exitApp }}>
      {children}
    </AuthContext.Provider>
  );
};

