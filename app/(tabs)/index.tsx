import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/HomeHeader';
import WeekCalendar from '../../components/WeekCalendar';

export default function HomeScreen() {


  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomeHeader />
      <WeekCalendar />
      {/* Rest of the content */}
      <View className="flex-1 items-center justify-center px-8">
        <Text className="text-gray-600 text-center">
          Your dream journal awaits.
        </Text>
      </View>
    </SafeAreaView>
  );
}

