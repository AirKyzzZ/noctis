import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const extra = (Constants?.expoConfig?.extra ?? {}) as Record<string, unknown>;
const supabaseUrl = (process.env.EXPO_PUBLIC_SUPABASE_URL || (extra?.supabaseUrl as string) || '') as string;
const supabaseAnonKey = (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || (extra?.supabaseAnonKey as string) || '') as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY or expo.extra in app.json');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;


