import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { colors } from '../../constants/colors';

interface CTAButtonsProps {
  onLoginPress: () => void;
  onSignUpPress: () => void;
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({ onLoginPress, onSignUpPress }) => {
  return (
    <View className="px-8 w-full gap-4">
      <Pressable
        onPress={onSignUpPress}
        className="py-4 rounded-xl active:opacity-80"
        style={{ backgroundColor: colors.accent }}
      >
        <Text className="text-black text-center font-bold text-lg">Créer un compte</Text>
      </Pressable>
      <Pressable
        onPress={onLoginPress}
        className="bg-gray-100 py-4 rounded-xl active:opacity-80 border border-gray-300"
      >
        <Text className="text-black text-center font-bold text-lg">Se connecter</Text>
      </Pressable>
    </View>
  );
};

