import React, { useState } from 'react';
import { View, Text, Pressable, Alert, TextInput, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../../providers/AuthContext';
import { useProfile } from '../../providers/ProfileContext';
import { pickImage } from '../../utils/imagePicker';

export default function ProfileScreen() {
  const { exitApp } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const [name, setName] = useState(profile.name);
  const [surname, setSurname] = useState(profile.surname);
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when profile loads
  React.useEffect(() => {
    setName(profile.name);
    setSurname(profile.surname);
  }, [profile]);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({ name, surname });
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
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
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#000000" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-1 px-8 py-8">
          <Text className="text-3xl font-bold text-gray-900 mb-8">Profile</Text>
          
          {/* Profile Picture */}
          <View className="items-center mb-8">
            <View className="relative">
              {profile.profilePicture ? (
                <Image
                  source={{ uri: profile.profilePicture }}
                  className="w-32 h-32 rounded-full"
                  style={{ backgroundColor: '#f3f4f6' }}
                />
              ) : (
                <View className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center">
                  <Feather name="user" size={48} color="#9ca3af" />
                </View>
              )}
              <Pressable
                onPress={handlePickImage}
                className="absolute bottom-0 right-0 bg-black rounded-full p-3 active:opacity-80"
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
              <Text className="text-sm font-semibold text-gray-700 mb-2">First Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your first name"
                placeholderTextColor="#9ca3af"
                className="bg-gray-100 px-4 py-4 rounded-xl text-gray-900"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-700 mb-2">Last Name</Text>
              <TextInput
                value={surname}
                onChangeText={setSurname}
                placeholder="Enter your last name"
                placeholderTextColor="#9ca3af"
                className="bg-gray-100 px-4 py-4 rounded-xl text-gray-900"
              />
            </View>

            <Pressable
              onPress={handleSaveProfile}
              disabled={isSaving}
              className="bg-black py-4 rounded-xl active:opacity-80 mt-2"
            >
              {isSaving ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">Save Profile</Text>
              )}
            </Pressable>
          </View>

          <View className="gap-4 mb-8">
            <Text className="text-base text-gray-600">
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
    </SafeAreaView>
  );
}

