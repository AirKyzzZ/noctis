import { StatusBar } from 'expo-status-bar';
import { Text, TextInput, View, Pressable, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import './global.css';
import { useEffect, useMemo, useState } from 'react';
import supabase from './supabase/client';
import BottomNavbar from './components/BottomNavbar';
import type { BottomTabItem } from './components/BottomNavbar';

export default function App() {
  const [fontsLoaded] = useFonts({
    'ProximaNova-Regular': require('./assets/ProximaNova/proximanova_regular.ttf'),
    'ProximaNova-Bold': require('./assets/ProximaNova/proximanova_bold.otf'),
    'ProximaNova-Light': require('./assets/ProximaNova/proximanova_light.otf'),
    'ProximaNova-Black': require('./assets/ProximaNova/proximanova_black.otf'),
    'ProximaNova-ExtraBold': require('./assets/ProximaNova/proximanova_extrabold.otf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      const session = data.session;
      setUserEmail(session?.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      isMounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleSignUp() {
    if (!email || !password) return Alert.alert('Erreur', 'Email et mot de passe requis');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      Alert.alert('Vérifiez votre email', "Un lien de confirmation vous a été envoyé.");
    } catch (err: any) {
      Alert.alert('Inscription échouée', err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignIn() {
    if (!email || !password) return Alert.alert('Erreur', 'Email et mot de passe requis');
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      Alert.alert('Connexion échouée', err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err: any) {
      Alert.alert('Déconnexion échouée', err.message ?? 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  if (!fontsLoaded) {
    return null;
  }

  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = [(Text as any).defaultProps.style, { fontFamily: 'ProximaNova-Regular' }];

  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.style = [(TextInput as any).defaultProps.style, { fontFamily: 'ProximaNova-Regular' }];

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 items-center justify-center bg-background px-6">
        {!userEmail ? (
          <View className="w-full max-w-md gap-4">
            <Text className="text-2xl font-bold text-blue-500 mb-2">Créer un compte / Se connecter</Text>
            <TextInput
              className="w-full rounded-md border border-gray-300 px-3 py-3"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <TextInput
              className="w-full rounded-md border border-gray-300 px-3 py-3"
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
            />
            <View className="flex-row gap-3 mt-2">
              <Pressable
                className="flex-1 items-center rounded-md bg-blue-600 py-3 disabled:opacity-50"
                disabled={loading}
                onPress={handleSignUp}
              >
                <Text className="text-white font-bold">S'inscrire</Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center rounded-md bg-gray-900 py-3 disabled:opacity-50"
                disabled={loading}
                onPress={handleSignIn}
              >
                <Text className="text-white font-bold">Se connecter</Text>
              </Pressable>
            </View>
            <Text className="text-xs text-gray-500 mt-2">
              En vous inscrivant, vous acceptez nos conditions d'utilisation.
            </Text>
          </View>
        ) : (
          <View className="items-center">
            <Text className="text-2xl font-bold mb-2">Bienvenue 👋</Text>
            <Text className="text-gray-700 mb-6">Connecté en tant que {userEmail}</Text>
            <Pressable
              className="items-center rounded-md bg-red-600 px-6 py-3 disabled:opacity-50"
              disabled={loading}
              onPress={handleSignOut}
            >
              <Text className="text-white font-bold">Se déconnecter</Text>
            </Pressable>
          </View>
        )}
        <StatusBar style="auto" />
        <BottomTabsDemo />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function BottomTabsDemo() {
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
    <BottomNavbar
      tabs={tabs}
      activeKey={active}
      onTabPress={setActive}
    />
  );
}
