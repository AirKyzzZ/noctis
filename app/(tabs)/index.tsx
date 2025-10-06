import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/home/HomeHeader';
import WeekCalendar from '../../components/home/WeekCalendar';
import QuickAddDreamCard from '../../components/home/QuickAddDreamCard';
import { StatsOverview } from '../../components/home';
import { useTheme } from '../../providers/ThemeContext';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <HomeHeader />
      <QuickAddDreamCard />
      <StatsOverview />
      <WeekCalendar />
    </SafeAreaView>
  );
}

