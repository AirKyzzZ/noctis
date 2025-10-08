import AsyncStorage from '@react-native-async-storage/async-storage';
import { AstronomyResponse, AstronomyData, CachedAstronomyData } from '../types/astronomy';

const STORMGLASS_API_URL = 'https://api.stormglass.io/v2/astronomy/point';
const BORDEAUX_LAT = 44.8667;
const BORDEAUX_LNG = -0.5597;

// Storage keys
const STORAGE_KEYS = {
  DAILY_REQUEST_COUNT: 'stormglass_daily_request_count',
  LAST_REQUEST_DATE: 'stormglass_last_request_date',
  CACHED_ASTRONOMY_DATA: 'stormglass_cached_astronomy_data',
};

const MAX_DAILY_REQUESTS = 10;

/**
 * Get the current date in YYYY-MM-DD format
 */
const getCurrentDate = (): string => {
  const now = new Date();
  return now.toISOString().split('T')[0];
};

/**
 * Reset daily request count if it's a new day
 */
const resetCountIfNewDay = async (): Promise<void> => {
  const lastRequestDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_REQUEST_DATE);
  const currentDate = getCurrentDate();

  if (lastRequestDate !== currentDate) {
    await AsyncStorage.setItem(STORAGE_KEYS.DAILY_REQUEST_COUNT, '0');
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_REQUEST_DATE, currentDate);
  }
};

/**
 * Get current daily request count
 */
export const getDailyRequestCount = async (): Promise<number> => {
  await resetCountIfNewDay();
  const count = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_REQUEST_COUNT);
  return count ? parseInt(count, 10) : 0;
};

/**
 * Increment daily request count
 */
const incrementRequestCount = async (): Promise<void> => {
  const count = await getDailyRequestCount();
  await AsyncStorage.setItem(STORAGE_KEYS.DAILY_REQUEST_COUNT, (count + 1).toString());
};

/**
 * Check if we can make a request (under daily limit)
 */
export const canMakeRequest = async (): Promise<boolean> => {
  const count = await getDailyRequestCount();
  return count < MAX_DAILY_REQUESTS;
};

/**
 * Get cached astronomy data for a specific date
 */
export const getCachedAstronomyData = async (date: string): Promise<AstronomyData | null> => {
  try {
    const cachedDataJson = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ASTRONOMY_DATA);
    if (!cachedDataJson) return null;

    const cachedData: Record<string, CachedAstronomyData> = JSON.parse(cachedDataJson);
    const dateData = cachedData[date];

    if (dateData && dateData.date === date) {
      return dateData.data;
    }

    return null;
  } catch (error) {
    console.error('Error reading cached astronomy data:', error);
    return null;
  }
};

/**
 * Cache astronomy data for a specific date
 */
const cacheAstronomyData = async (date: string, data: AstronomyData): Promise<void> => {
  try {
    const cachedDataJson = await AsyncStorage.getItem(STORAGE_KEYS.CACHED_ASTRONOMY_DATA);
    const cachedData: Record<string, CachedAstronomyData> = cachedDataJson 
      ? JSON.parse(cachedDataJson) 
      : {};

    cachedData[date] = {
      data,
      timestamp: Date.now(),
      date,
    };

    // Keep only last 30 days of cache to prevent bloat
    const dates = Object.keys(cachedData).sort().reverse();
    if (dates.length > 30) {
      const datesToKeep = dates.slice(0, 30);
      const newCachedData: Record<string, CachedAstronomyData> = {};
      datesToKeep.forEach(d => {
        newCachedData[d] = cachedData[d];
      });
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_ASTRONOMY_DATA, JSON.stringify(newCachedData));
    } else {
      await AsyncStorage.setItem(STORAGE_KEYS.CACHED_ASTRONOMY_DATA, JSON.stringify(cachedData));
    }
  } catch (error) {
    console.error('Error caching astronomy data:', error);
  }
};

/**
 * Fetch astronomy data from StormGlass API
 * This should be called sparingly - max 10 times per day
 */
export const fetchAstronomyData = async (
  apiKey: string,
  date?: string
): Promise<AstronomyData | null> => {
  const targetDate = date || getCurrentDate();

  // First, check cache
  const cached = await getCachedAstronomyData(targetDate);
  if (cached) {
    // eslint-disable-next-line no-console
    console.log(`Using cached data for ${targetDate}`);
    return cached;
  }

  // Check if we can make a request
  if (!(await canMakeRequest())) {
    console.warn('Daily API request limit reached (10/10)');
    return null;
  }

  try {
    const url = `${STORMGLASS_API_URL}?lat=${BORDEAUX_LAT}&lng=${BORDEAUX_LNG}&end=${targetDate}`;
    
    // eslint-disable-next-line no-console
    console.log(`Making API request for ${targetDate} (${await getDailyRequestCount() + 1}/10)`);
    
    const response = await fetch(url, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const jsonData: AstronomyResponse = await response.json();

    if (jsonData.data && jsonData.data.length > 0) {
      // Use the last entry as it corresponds to the requested date
      const astronomyData = jsonData.data[jsonData.data.length - 1];
      
      // Increment request count
      await incrementRequestCount();
      
      // Cache the data
      await cacheAstronomyData(targetDate, astronomyData);

      return astronomyData;
    }

    return null;
  } catch (error) {
    console.error('Error fetching astronomy data:', error);
    return null;
  }
};

/**
 * Get remaining API requests for today
 */
export const getRemainingRequests = async (): Promise<number> => {
  const count = await getDailyRequestCount();
  return Math.max(0, MAX_DAILY_REQUESTS - count);
};

/**
 * Clear all cached data (useful for debugging)
 */
export const clearAllCache = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEYS.CACHED_ASTRONOMY_DATA);
  await AsyncStorage.removeItem(STORAGE_KEYS.DAILY_REQUEST_COUNT);
  await AsyncStorage.removeItem(STORAGE_KEYS.LAST_REQUEST_DATE);
};

