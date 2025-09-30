import { StatusBar } from 'expo-status-bar';
import { Text, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';

export default function App() {
  const [fontsLoaded] = useFonts({
    'ProximaNova-Regular': require('./assets/ProximaNova/proximanova_regular.ttf'),
    'ProximaNova-Bold': require('./assets/ProximaNova/proximanova_bold.otf'),
    'ProximaNova-Light': require('./assets/ProximaNova/proximanova_light.otf'),
    'ProximaNova-Black': require('./assets/ProximaNova/proximanova_black.otf'),
    'ProximaNova-ExtraBold': require('./assets/ProximaNova/proximanova_extrabold.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = [(Text as any).defaultProps.style, { fontFamily: 'ProximaNova-Regular' }];

  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.style = [(TextInput as any).defaultProps.style, { fontFamily: 'ProximaNova-Regular' }];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">Welcome to NativeWind!</Text>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
