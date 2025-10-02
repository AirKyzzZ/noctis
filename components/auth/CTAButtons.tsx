import React from 'react';
import { View, Pressable, Text } from 'react-native';

interface CTAButtonsProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({ onLoginPress, onSignUpPress }) => {
  return (
    <View className="px-8 w-full gap-4">
      <Pressable
        onPress={onSignUpPress}
        className="bg-blue-600 py-4 rounded-xl active:opacity-80"
      >
        <Text className="text-white text-center font-bold text-lg">Créer un compte</Text>
      </Pressable>
      <Pressable
        onPress={onLoginPress}
        className="bg-white/20 py-4 rounded-xl active:opacity-80 border border-white/30"
      >
        <Text className="text-white text-center font-bold text-lg">Se connecter</Text>
      </Pressable>
    </View>
  );
};

