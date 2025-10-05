import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/HomeHeader';
import WeekCalendar from '../../components/WeekCalendar';
import QuickAddDreamCard from '../../components/QuickAddDreamCard';
import { StatsOverview } from '../../components/home';

export default function HomeScreen() {


  return (
    <SafeAreaView className="flex-1 bg-white">
      <HomeHeader />
      <QuickAddDreamCard />
      <StatsOverview />
      <WeekCalendar />
    </SafeAreaView>
  );
}

