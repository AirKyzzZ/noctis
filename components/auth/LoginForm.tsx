import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import supabase from '../../supabase/client';

interface LoginFormProps {
  onSuccess?: () => void;
  onSignUpPress?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onSignUpPress }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;
      onSuccess?.();
    } catch (error: any) {
      Alert.alert('Connexion échouée', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="w-full px-8">
      <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">Se connecter</Text>

      <View className="gap-4">
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
            placeholder="votre.email@exemple.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            editable={!loading}
          />
        </View>

        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">Mot de passe</Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            autoComplete="password"
            editable={!loading}
          />
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 py-4 rounded-xl mt-4 active:opacity-80 disabled:opacity-50"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Se connecter</Text>
          )}
        </Pressable>

        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-gray-600">Pas encore de compte ? </Text>
          <Pressable onPress={onSignUpPress} disabled={loading}>
            <Text className="text-blue-600 font-bold">Créer un compte</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

