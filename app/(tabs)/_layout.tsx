import React from 'react';
import { View } from 'react-native';
import { Tabs, useRouter, usePathname } from 'expo-router';
import BottomNavbar, { type BottomTabItem } from '../../components/BottomNavbar';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Map pathname to active tab key
  const getActiveKey = () => {
    if (pathname === '/(tabs)' || pathname === '/') return 'home';
    if (pathname.includes('search')) return 'search';
    if (pathname.includes('notifications')) return 'bell';
    if (pathname.includes('profile')) return 'user';
    return 'home';
  };

  const [active, setActive] = React.useState(getActiveKey());

  // Update active state when pathname changes
  React.useEffect(() => {
    setActive(getActiveKey());
  }, [pathname]);
  
  const tabs: BottomTabItem[] = [
    { key: 'home', icon: 'home' as const, label: 'Accueil' },
    { key: 'search', icon: 'search' as const, label: 'Recherche' },
    { key: 'bell', icon: 'bell' as const, label: 'Notifications' },
    { key: 'user', icon: 'user' as const, label: 'Profil' },
  ];

  const handleTabPress = (key: string) => {
    setActive(key);
    // Navigate to the appropriate route
    switch (key) {
      case 'home':
        router.push('/(tabs)');
        break;
      case 'search':
        router.push('/(tabs)/search');
        break;
      case 'bell':
        router.push('/(tabs)/notifications');
        break;
      case 'user':
        router.push('/(tabs)/profile');
        break;
    }
  };

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
      <BottomNavbar tabs={tabs} activeKey={active} onTabPress={handleTabPress} />
    </View>
  );
}

