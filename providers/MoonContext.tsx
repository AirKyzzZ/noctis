import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Constants from 'expo-constants';
import { AstronomyData, DreamForecast } from '../types/astronomy';
import { 
  fetchAstronomyData, 
  getCachedAstronomyData, 
  getDailyRequestCount,
  getRemainingRequests,
} from '../utils/stormglassApi';
import { generateDreamForecast } from '../utils/dreamForecastAlgorithm';

// Get API key from environment variables
const getApiKey = (): string | null => {
  // Try to get from expo constants (works in managed expo)
  const envApiKey = Constants.expoConfig?.extra?.STORMGLASS_API || 
                    process.env['STORMGLASS-API'] ||
                    process.env.STORMGLASS_API;
  return envApiKey || null;
};

interface MoonContextType {
  astronomyData: AstronomyData | null;
  dreamForecast: DreamForecast | null;
  loading: boolean;
  error: string | null;
  dailyRequestCount: number;
  remainingRequests: number;
  refreshForecast: () => Promise<void>;
}

const MoonContext = createContext<MoonContextType | undefined>(undefined);

export const useMoon = () => {
  const context = useContext(MoonContext);
  if (!context) {
    throw new Error('useMoon must be used within MoonProvider');
  }
  return context;
};

interface MoonProviderProps {
  children: ReactNode;
}

export const MoonProvider: React.FC<MoonProviderProps> = ({ children }) => {
  const [astronomyData, setAstronomyData] = useState<AstronomyData | null>(null);
  const [dreamForecast, setDreamForecast] = useState<DreamForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyRequestCount, setDailyRequestCount] = useState(0);
  const [remainingRequests, setRemainingRequests] = useState(10);

  // Load astronomy data on mount
  useEffect(() => {
    loadAstronomyData();
  }, []);

  const updateRequestCounts = async () => {
    const count = await getDailyRequestCount();
    const remaining = await getRemainingRequests();
    setDailyRequestCount(count);
    setRemainingRequests(remaining);
  };

  const loadAstronomyData = async () => {
    const apiKey = getApiKey();
    
    if (!apiKey) {
      setError('API key not configured. Please contact support.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // First, try to get cached data
      let data = await getCachedAstronomyData(today);
      
      // If no cache, fetch from API
      if (!data) {
        data = await fetchAstronomyData(apiKey, today);
      }

      if (data) {
        setAstronomyData(data);
        
        // Generate forecast from astronomy data
        const forecast = generateDreamForecast(data);
        setDreamForecast(forecast);
        
        setError(null);
      } else {
        setError('Unable to load astronomy data. Daily limit may be reached.');
      }

      // Update request counts
      await updateRequestCounts();
    } catch (err) {
      console.error('Error loading astronomy data:', err);
      setError('Failed to load moon data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const refreshForecast = async () => {
    await loadAstronomyData();
  };

  const value: MoonContextType = {
    astronomyData,
    dreamForecast,
    loading,
    error,
    dailyRequestCount,
    remainingRequests,
    refreshForecast,
  };

  return <MoonContext.Provider value={value}>{children}</MoonContext.Provider>;
};

