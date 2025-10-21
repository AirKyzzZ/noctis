import React, { useState } from 'react';
import { View, Text, Pressable, Alert, TextInput, Image, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../services/AuthService';
import { useProfile } from '../../services/ProfileService';
import { useTheme } from '../../services/ThemeService';
import { pickImage } from '../../utils/imagePicker';
import { ExportDreams } from '../../components/profile';

export default function ProfileScreen() {
  const { exitApp } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const { colors } = useTheme();
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [surname, setSurname] = useState(profile.surname);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when profile loads
  React.useEffect(() => {
    setName(profile.name);
    setSurname(profile.surname);
  }, [profile]);

  const handleSettingsPress = () => {
    router.push('/settings');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, surname });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      await updateProfile({ profilePicture: imageUri });
    }
  };

  const handleRemoveImage = async () => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await updateProfile({ profilePicture: null });
        },
      },
    ]);
  };

  const handleExitApp = async () => {
    Alert.alert('Exit App', 'Are you sure you want to exit the app?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: async () => {
          await exitApp();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.textPrimary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-8 py-8">
          {/* Header with Settings Icon */}
          <View className="flex-row items-center justify-between mb-8">
            <Text className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Profile</Text>
            <Pressable onPress={handleSettingsPress} className="active:opacity-70">
              <View
                className="w-10 h-10 rounded-full items-center justify-center"
                style={{ backgroundColor: colors.gray100 }}
              >
                <Feather 
                  name="settings" 
                  size={20} 
                  color={colors.textPrimary} 
                />
              </View>
            </Pressable>
          </View>
          
          {/* Profile Picture */}
          <View className="items-center mb-8">
            <View className="relative">
              {profile.profilePicture ? (
                <Image
                  source={{ uri: profile.profilePicture }}
                  className="w-32 h-32 rounded-full"
                  style={{ backgroundColor: colors.gray200 }}
                />
              ) : (
                <View className="w-32 h-32 rounded-full items-center justify-center" style={{ backgroundColor: colors.gray200 }}>
                  <Feather name="user" size={48} color={colors.textTertiary} />
                </View>
              )}
              <Pressable
                onPress={handlePickImage}
                className="absolute bottom-0 right-0 bg-accent rounded-full p-3 active:opacity-80"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Feather name="camera" size={20} color="white" />
              </Pressable>
            </View>
            {profile.profilePicture && (
              <Pressable onPress={handleRemoveImage} className="mt-3">
                <Text className="text-red-600 text-sm">Remove Photo</Text>
              </Pressable>
            )}
          </View>

          {/* Profile Form */}
          <View className="gap-4 mb-8">
            <View>
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>First Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your first name"
                placeholderTextColor={colors.textTertiary}
                className="px-4 py-4 rounded-xl"
                style={{ backgroundColor: colors.inputBackground, color: colors.textPrimary }}
              />
            </View>

            <View>
              <Text className="text-sm font-semibold mb-2" style={{ color: colors.textSecondary }}>Last Name</Text>
              <TextInput
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter your last name"
                placeholderTextColor={colors.textTertiary}
                className="px-4 py-4 rounded-xl"
                style={{ backgroundColor: colors.inputBackground, color: colors.textPrimary }}
              />
            </View>

            <Pressable
              onPress={handleSaveProfile}
              disabled={isSaving}
              className="bg-accent py-4 rounded-xl active:opacity-80 mt-2"
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Save Profile</Text>
              )}
            </Pressable>
          </View>

          {/* Export Section */}
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3" style={{ color: colors.textPrimary }}>
              Data Management
            </Text>
            <ExportDreams />
          </View>

          <View className="gap-4 mb-8">
            <Text className="text-base" style={{ color: colors.textSecondary }}>
              Your profile data is stored locally on this device.
            </Text>
          </View>
          
          <Pressable
            onPress={handleExitApp}
            className="bg-red-600 py-4 rounded-xl active:opacity-80"
          >
            <Text className="text-white text-center font-bold text-lg">Exit App</Text>
          </Pressable>
        </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

