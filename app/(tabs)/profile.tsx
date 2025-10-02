import React from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../providers/AuthContext';

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-8">Profil</Text>
        
        {profile && (
          <View className="gap-4 mb-8">
            <View>
              <Text className="text-sm text-gray-500">Nom complet</Text>
              <Text className="text-lg text-gray-900">
                {profile.first_name} {profile.last_name}
              </Text>
            </View>
            
            <View>
              <Text className="text-sm text-gray-500">Email</Text>
              <Text className="text-lg text-gray-900">{profile.email}</Text>
            </View>
          </View>
        )}
        
        <Pressable
          onPress={handleSignOut}
          className="bg-red-600 py-4 rounded-xl active:opacity-80"
        >
          <Text className="text-white text-center font-bold text-lg">Se déconnecter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

