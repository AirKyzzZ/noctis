import React from 'react';
import { Text, View } from 'react-native';

export const IntroText: React.FC = () => {
  return (
    <View className="px-8 mb-8">
      <Text className="text-white text-3xl font-bold text-center mb-4">
        Bienvenue sur Noctis
      </Text>
      <Text className="text-white/80 text-center text-base leading-6">
        Capturez vos rêves, explorez votre inconscient et découvrez les patterns cachés de votre
        vie nocturne. Votre journal de rêves personnel et intelligent.
      </Text>
    </View>
  );
};

