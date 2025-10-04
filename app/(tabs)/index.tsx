import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/HomeHeader';
import WeekCalendar from '../../components/WeekCalendar';
import QuickAddDreamCard from '../../components/QuickAddDreamCard';

export default function HomeScreen() {


  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomeHeader />
      <QuickAddDreamCard />
      <WeekCalendar />
    </SafeAreaView>
  );
}

