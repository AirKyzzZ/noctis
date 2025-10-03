import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  surname: string;
  profilePicture: string | null;
}

interface ProfileContextType {
  profile: UserProfile;
  loading: boolean;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => Promise<void>;
}

const defaultProfile: UserProfile = {
  name: '',
  surname: '',
  profilePicture: null,
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  loading: true,
  updateProfile: async () => {},
  clearProfile: async () => {},
});

export const useProfile = () => useContext(ProfileContext);

const PROFILE_STORAGE_KEY = '@noctis_profile';

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profileData = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      if (profileData) {
        setProfile(JSON.parse(profileData));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = { ...profile, ...updates };
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const clearProfile = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      setProfile(defaultProfile);
    } catch (error) {
      console.error('Error clearing profile:', error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, updateProfile, clearProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

