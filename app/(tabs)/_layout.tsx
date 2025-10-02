import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import BottomNavbar, { type BottomTabItem } from '../../components/BottomNavbar';

export default function TabsLayout() {
  const [active, setActive] = React.useState('home');
  
  const tabs: BottomTabItem[] = [
    { key: 'home', icon: 'home' as const, label: 'Accueil' },
    { key: 'search', icon: 'search' as const, label: 'Recherche' },
    { key: 'bell', icon: 'bell' as const, label: 'Notifications' },
    { key: 'user', icon: 'user' as const, label: 'Profil' },
  ];

  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
        }}
      >
        <Tabs.Screen name="index" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="notifications" />
        <Tabs.Screen name="profile" />
      </Tabs>
      <BottomNavbar tabs={tabs} activeKey={active} onTabPress={setActive} />
    </View>
  );
}

