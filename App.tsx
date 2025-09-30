import { StatusBar } from 'expo-status-bar';
import { Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">Welcome to NativeWind!</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
