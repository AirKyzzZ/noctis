import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeHeader from '../../components/home/HomeHeader';
import WeekCalendar from '../../components/home/WeekCalendar';
import QuickAddDreamCard from '../../components/home/QuickAddDreamCard';
import { StatsOverview, DreamForecastCard, LibraryCard } from '../../components/home';
import { useTheme } from '../../services/ThemeService';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-24"
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <QuickAddDreamCard />
        <DreamForecastCard />
        <StatsOverview />
        <WeekCalendar />
        <LibraryCard />
      </ScrollView>
    </SafeAreaView>
  );
}

