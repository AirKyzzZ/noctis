import React from 'react';
import { Text, View } from 'react-native';

export const IntroText: React.FC = () => {
  return (
    <View className="px-8 mb-8">
      <Text className="text-black text-3xl font-bold text-center mb-4">
        Welcome to Noctis
      </Text>
      <Text className="text-black/70 text-center text-base leading-6">
      Capture your dreams, explore your subconscious, and discover the hidden patterns of your
      nightlife. Your personal, intelligent dream journal.
      </Text>
    </View>
  );
};

