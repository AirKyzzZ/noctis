import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import supabase from '../../supabase/client';
import { Ionicons } from '@expo/vector-icons';
import { pickImage } from '../../utils/imagePicker';

interface SignUpFormProps {
  onSuccess?: () => void;
  onLoginPress?: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSuccess, onLoginPress }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const uri = await pickImage();
    if (uri) {
      setPhotoUri(uri);
    }
  };

  const handleSignUp = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setLoading(true);

      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Update profile with additional information
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          avatar_url: photoUri,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        Alert.alert(
          'Compte créé !',
          'Vérifiez votre email pour confirmer votre compte.',
          [{ text: 'OK', onPress: onSuccess }]
        );
      }
    } catch (error: any) {
      Alert.alert('Inscription échouée', error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 w-full px-8" showsVerticalScrollIndicator={false}>
      <Text className="text-3xl font-bold text-gray-900 mb-8 text-center">Créer un compte</Text>

      <View className="gap-4">
        {/* Profile Photo */}
        <View className="items-center mb-4">
          <Pressable
            onPress={handlePickImage}
            className="w-24 h-24 rounded-full bg-gray-200 items-center justify-center overflow-hidden"
            disabled={loading}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} className="w-full h-full" />
            ) : (
              <View className="items-center">
                <Ionicons name="camera" size={32} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 mt-1">Optionnel</Text>
              </View>
            )}
          </Pressable>
          <Text className="text-sm text-gray-600 mt-2">Photo de profil</Text>
        </View>

        {/* First Name */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Prénom <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
            placeholder="Jean"
            value={firstName}
            onChangeText={setFirstName}
            autoCapitalize="words"
            textContentType="givenName"
            autoComplete="name-given"
            editable={!loading}
          />
        </View>

        {/* Last Name */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Nom <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
            placeholder="Dupont"
            value={lastName}
            onChangeText={setLastName}
            autoCapitalize="words"
            textContentType="familyName"
            autoComplete="name-family"
            editable={!loading}
          />
        </View>

        {/* Email */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Email <Text className="text-red-500">*</Text>
          </Text>
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

        {/* Password */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Mot de passe <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
            placeholder="Minimum 6 caractères"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="password-new"
            editable={!loading}
          />
        </View>

        {/* Confirm Password */}
        <View>
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Confirmer le mot de passe <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white"
            placeholder="Confirmez votre mot de passe"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            textContentType="newPassword"
            autoComplete="password-new"
            editable={!loading}
          />
        </View>

        <Pressable
          onPress={handleSignUp}
          disabled={loading}
          className="bg-blue-600 py-4 rounded-xl mt-4 active:opacity-80 disabled:opacity-50"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">Créer mon compte</Text>
          )}
        </Pressable>

        <Text className="text-xs text-gray-500 text-center mt-2">
          En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de
          confidentialité.
        </Text>

        <View className="flex-row justify-center items-center mt-6 mb-8">
          <Text className="text-gray-600">Déjà un compte ? </Text>
          <Pressable onPress={onLoginPress} disabled={loading}>
            <Text className="text-blue-600 font-bold">Se connecter</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

