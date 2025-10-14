import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dream, DreamStats, DreamType } from '../types/dream';

interface DreamContextType {
  dreams: Dream[];
  stats: DreamStats;
  loading: boolean;
  addDream: (dream: Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDream: (id: string, dream: Partial<Dream>) => Promise<void>;
  deleteDream: (id: string) => Promise<void>;
  getDreamById: (id: string) => Dream | undefined;
  refreshStats: () => void;
}

const DreamContext = createContext<DreamContextType>({
  dreams: [],
  stats: {
    totalDreams: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastDreamDate: null,
    dreamTypeDistribution: {} as Record<DreamType, number>,
    averageSleepQuality: 0,
    averageClarity: 0,
  },
  loading: true,
  addDream: async () => {},
  updateDream: async () => {},
  deleteDream: async () => {},
  getDreamById: () => undefined,
  refreshStats: () => {},
});

export const useDreams = () => useContext(DreamContext);

const DREAMS_STORAGE_KEY = '@noctis_dreams';
const STATS_STORAGE_KEY = '@noctis_dream_stats';

export const DreamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [stats, setStats] = useState<DreamStats>({
    totalDreams: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastDreamDate: null,
    dreamTypeDistribution: {
      ordinary: 0,
      lucid: 0,
      nightmare: 0,
      recurring: 0,
      prophetic: 0,
      healing: 0,
    },
    averageSleepQuality: 0,
    averageClarity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDreams();
  }, []);

  const loadDreams = async () => {
    try {
      const [dreamsData, statsData] = await Promise.all([
        AsyncStorage.getItem(DREAMS_STORAGE_KEY),
        AsyncStorage.getItem(STATS_STORAGE_KEY),
      ]);

      if (dreamsData) {
        const parsedDreams = JSON.parse(dreamsData);
        setDreams(parsedDreams);
      }

      if (statsData) {
        setStats(JSON.parse(statsData));
      } else {
        // Calculate stats from dreams if not stored
        calculateStats(dreamsData ? JSON.parse(dreamsData) : []);
      }
    } catch (error) {
      console.error('Error loading dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDreams = async (newDreams: Dream[]) => {
    try {
      await AsyncStorage.setItem(DREAMS_STORAGE_KEY, JSON.stringify(newDreams));
      setDreams(newDreams);
      calculateStats(newDreams);
    } catch (error) {
      console.error('Error saving dreams:', error);
    }
  };

  const calculateStats = useCallback((dreamList: Dream[]) => {
    const newStats: DreamStats = {
      totalDreams: dreamList.length,
      currentStreak: 0,
      longestStreak: 0,
      lastDreamDate: null,
      dreamTypeDistribution: {
        ordinary: 0,
        lucid: 0,
        nightmare: 0,
        recurring: 0,
        prophetic: 0,
        healing: 0,
      },
      averageSleepQuality: 0,
      averageClarity: 0,
    };

    if (dreamList.length === 0) {
      setStats(newStats);
      AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
      return;
    }

    // Sort dreams by date (newest first)
    const sortedDreams = [...dreamList].sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
    );

    newStats.lastDreamDate = sortedDreams[0].dateTime;

    // Calculate streaks (dreams on consecutive days)
    // First, group dreams by date to handle multiple dreams on the same day
    const uniqueDates: number[] = [];
    const dateSet = new Set<number>();
    
    sortedDreams.forEach((dream) => {
      const dreamDate = new Date(dream.dateTime);
      dreamDate.setHours(0, 0, 0, 0); // Normalize to start of day
      const dateTime = dreamDate.getTime();
      
      if (!dateSet.has(dateTime)) {
        dateSet.add(dateTime);
        uniqueDates.push(dateTime);
      }
    });

    // Now calculate streaks based on unique dates
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();

    // Check if the most recent dream is today or yesterday
    if (uniqueDates.length > 0) {
      const mostRecentDream = uniqueDates[0];
      if (mostRecentDream === todayTime || mostRecentDream === yesterdayTime) {
        currentStreak = 1;
        
        // Count consecutive days
        for (let i = 1; i < uniqueDates.length; i++) {
          const prevDate = uniqueDates[i - 1];
          const currDate = uniqueDates[i];
          const diffTime = prevDate - currDate;
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          
          if (diffDays === 1) {
            currentStreak++;
            tempStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate longest streak
    tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = uniqueDates[i - 1];
      const currDate = uniqueDates[i];
      const diffTime = prevDate - currDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    newStats.currentStreak = currentStreak;
    newStats.longestStreak = Math.max(longestStreak, currentStreak);

    // Calculate dream type distribution
    dreamList.forEach((dream) => {
      newStats.dreamTypeDistribution[dream.type]++;
    });

    // Calculate averages
    const totalSleepQuality = dreamList.reduce((sum, dream) => sum + dream.sleepQuality, 0);
    const totalClarity = dreamList.reduce((sum, dream) => sum + dream.clarity, 0);
    
    newStats.averageSleepQuality = Number((totalSleepQuality / dreamList.length).toFixed(1));
    newStats.averageClarity = Number((totalClarity / dreamList.length).toFixed(1));

    setStats(newStats);
    AsyncStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));
  }, []);

  const refreshStats = useCallback(() => {
    calculateStats(dreams);
  }, [dreams, calculateStats]);

  const addDream = async (dreamData: Omit<Dream, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newDream: Dream = {
      ...dreamData,
      id: `dream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: now,
      updatedAt: now,
    };

    const updatedDreams = [newDream, ...dreams];
    await saveDreams(updatedDreams);
  };

  const updateDream = async (id: string, dreamData: Partial<Dream>) => {
    const updatedDreams = dreams.map((dream) =>
      dream.id === id
        ? { ...dream, ...dreamData, updatedAt: new Date().toISOString() }
        : dream
    );
    await saveDreams(updatedDreams);
  };

  const deleteDream = async (id: string) => {
    const updatedDreams = dreams.filter((dream) => dream.id !== id);
    await saveDreams(updatedDreams);
  };

  const getDreamById = (id: string) => {
    return dreams.find((dream) => dream.id === id);
  };

  return (
    <DreamContext.Provider
      value={{
        dreams,
        stats,
        loading,
        addDream,
        updateDream,
        deleteDream,
        getDreamById,
        refreshStats,
      }}
    >
      {children}
    </DreamContext.Provider>
  );
};

