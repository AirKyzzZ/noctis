import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import BottomNavbar, { type BottomTabItem } from './BottomNavbar';

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const [active, setActive] = useState('home');
  const tabs = useMemo<BottomTabItem[]>(
    () => [
      { key: 'home', icon: 'home' as const, label: 'Accueil' },
      { key: 'search', icon: 'search' as const, label: 'Recherche' },
      { key: 'bell', icon: 'bell' as const, label: 'Notifications' },
      { key: 'user', icon: 'user' as const, label: 'Profil' },
    ],
    []
  );

  return (
    <View className="flex-1">
      <View className="flex-1 items-center justify-center">
        {children}
      </View>
      <BottomNavbar tabs={tabs} activeKey={active} onTabPress={setActive} />
    </View>
  );
}


