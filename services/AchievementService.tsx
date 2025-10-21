import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement, AchievementId, AchievementStats, Challenge } from '../types/achievement';
import { useDreams } from './DreamService';
import { Alert } from 'react-native';

interface AchievementContextType {
  achievements: Achievement[];
  challenges: Challenge[];
  stats: AchievementStats;
  loading: boolean;
  refreshAchievements: () => Promise<void>;
  unlockAchievement: (id: AchievementId) => Promise<void>;
  updateProgress: (id: AchievementId, progress: number) => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType>({
  achievements: [],
  challenges: [],
  stats: {
    totalUnlocked: 0,
    totalAchievements: 0,
    completionPercentage: 0,
    rarityCount: { common: 0, rare: 0, epic: 0, legendary: 0 },
  },
  loading: true,
  refreshAchievements: async () => {},
  unlockAchievement: async () => {},
  updateProgress: async () => {},
});

export const useAchievements = () => useContext(AchievementContext);

const ACHIEVEMENTS_STORAGE_KEY = '@noctis_achievements';

// Define all available achievements
const INITIAL_ACHIEVEMENTS: Omit<Achievement, 'progress' | 'unlocked' | 'unlockedAt'>[] = [
  // Streak achievements
  {
    id: 'first_dream',
    title: 'Dream Journal Begins',
    description: 'Record your first dream',
    icon: '📖',
    category: 'streak',
    requirement: 1,
    rarity: 'common',
  },
  {
    id: 'streak_3',
    title: 'Consistent Dreamer',
    description: 'Record dreams for 3 days in a row',
    icon: '🔥',
    category: 'streak',
    requirement: 3,
    rarity: 'common',
  },
  {
    id: 'streak_7',
    title: 'Weekly Warrior',
    description: 'Record dreams for 7 days in a row',
    icon: '⭐',
    category: 'streak',
    requirement: 7,
    rarity: 'rare',
  },
  {
    id: 'streak_14',
    title: 'Fortnight Master',
    description: 'Record dreams for 14 days in a row',
    icon: '🌟',
    category: 'streak',
    requirement: 14,
    rarity: 'rare',
  },
  {
    id: 'streak_30',
    title: 'Monthly Champion',
    description: 'Record dreams for 30 days in a row',
    icon: '💫',
    category: 'streak',
    requirement: 30,
    rarity: 'epic',
  },
  {
    id: 'streak_100',
    title: 'Dream Legend',
    description: 'Record dreams for 100 days in a row',
    icon: '👑',
    category: 'streak',
    requirement: 100,
    rarity: 'legendary',
  },
  // Dream type achievements
  {
    id: 'first_lucid',
    title: 'Lucid Awakening',
    description: 'Record your first lucid dream',
    icon: '🌙',
    category: 'dream_type',
    requirement: 1,
    rarity: 'rare',
  },
  {
    id: 'lucid_master',
    title: 'Lucid Master',
    description: 'Record 10 lucid dreams',
    icon: '✨',
    category: 'dream_type',
    requirement: 10,
    rarity: 'epic',
  },
  {
    id: 'nightmare_survivor',
    title: 'Nightmare Survivor',
    description: 'Record and overcome 5 nightmares',
    icon: '🛡️',
    category: 'dream_type',
    requirement: 5,
    rarity: 'rare',
  },
  {
    id: 'dream_explorer',
    title: 'Dream Explorer',
    description: 'Experience all types of dreams',
    icon: '🗺️',
    category: 'dream_type',
    requirement: 6,
    rarity: 'epic',
  },
  // Quantity achievements
  {
    id: 'dreams_10',
    title: 'Dream Collector',
    description: 'Record 10 dreams',
    icon: '📚',
    category: 'quantity',
    requirement: 10,
    rarity: 'common',
  },
  {
    id: 'dreams_50',
    title: 'Dream Archivist',
    description: 'Record 50 dreams',
    icon: '📜',
    category: 'quantity',
    requirement: 50,
    rarity: 'rare',
  },
  {
    id: 'dreams_100',
    title: 'Dream Historian',
    description: 'Record 100 dreams',
    icon: '🏛️',
    category: 'quantity',
    requirement: 100,
    rarity: 'epic',
  },
  {
    id: 'dreams_365',
    title: 'Year of Dreams',
    description: 'Record 365 dreams',
    icon: '🎯',
    category: 'quantity',
    requirement: 365,
    rarity: 'legendary',
  },
  // Quality achievements
  {
    id: 'high_clarity',
    title: 'Crystal Clear',
    description: 'Record 10 dreams with maximum clarity',
    icon: '💎',
    category: 'quality',
    requirement: 10,
    rarity: 'rare',
  },
  {
    id: 'sleep_master',
    title: 'Sleep Master',
    description: 'Record 10 dreams with perfect sleep quality',
    icon: '😴',
    category: 'quality',
    requirement: 10,
    rarity: 'rare',
  },
  {
    id: 'emotional_balance',
    title: 'Emotional Balance',
    description: 'Experience all emotional states',
    icon: '☯️',
    category: 'quality',
    requirement: 8,
    rarity: 'epic',
  },
  // Exploration achievements
  {
    id: 'tag_collector',
    title: 'Tag Collector',
    description: 'Use 50 unique tags across your dreams',
    icon: '🏷️',
    category: 'exploration',
    requirement: 50,
    rarity: 'rare',
  },
  {
    id: 'location_traveler',
    title: 'Location Traveler',
    description: 'Visit 20 unique locations in dreams',
    icon: '🌍',
    category: 'exploration',
    requirement: 20,
    rarity: 'rare',
  },
  {
    id: 'character_social',
    title: 'Social Dreamer',
    description: 'Meet 30 unique characters in dreams',
    icon: '👥',
    category: 'exploration',
    requirement: 30,
    rarity: 'rare',
  },
];

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const { dreams, stats: dreamStats } = useDreams();

  // Initialize achievements from storage or create new ones
  useEffect(() => {
    loadAchievements();
  }, []);

  // Check and update achievement progress when dreams change
  useEffect(() => {
    if (!loading && dreams.length > 0) {
      checkAchievementProgress();
    }
  }, [dreams, dreamStats, loading]);

  const loadAchievements = async () => {
    try {
      const stored = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
      if (stored) {
        setAchievements(JSON.parse(stored));
      } else {
        // Initialize with default achievements
        const initial = INITIAL_ACHIEVEMENTS.map(a => ({
          ...a,
          progress: 0,
          unlocked: false,
        }));
        setAchievements(initial);
        await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAchievementProgress = useCallback(async () => {
    const updatedAchievements = [...achievements];
    let hasChanges = false;
    const newlyUnlocked: Achievement[] = [];

    // Check streak achievements
    const streakAchievements = ['first_dream', 'streak_3', 'streak_7', 'streak_14', 'streak_30', 'streak_100'];
    streakAchievements.forEach(id => {
      const achievement = updatedAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const newProgress = dreamStats.currentStreak;
        if (newProgress !== achievement.progress) {
          achievement.progress = newProgress;
          hasChanges = true;
          if (newProgress >= achievement.requirement) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            newlyUnlocked.push(achievement);
          }
        }
      }
    });

    // Check quantity achievements
    const quantityAchievements = ['dreams_10', 'dreams_50', 'dreams_100', 'dreams_365'];
    quantityAchievements.forEach(id => {
      const achievement = updatedAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const newProgress = dreamStats.totalDreams;
        if (newProgress !== achievement.progress) {
          achievement.progress = newProgress;
          hasChanges = true;
          if (newProgress >= achievement.requirement) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            newlyUnlocked.push(achievement);
          }
        }
      }
    });

    // Check lucid dream achievements
    const lucidDreams = dreams.filter(d => d.type === 'lucid').length;
    ['first_lucid', 'lucid_master'].forEach(id => {
      const achievement = updatedAchievements.find(a => a.id === id);
      if (achievement && !achievement.unlocked) {
        const newProgress = lucidDreams;
        if (newProgress !== achievement.progress) {
          achievement.progress = newProgress;
          hasChanges = true;
          if (newProgress >= achievement.requirement) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date().toISOString();
            newlyUnlocked.push(achievement);
          }
        }
      }
    });

    // Check nightmare achievements
    const nightmares = dreams.filter(d => d.type === 'nightmare').length;
    const nightmareAchievement = updatedAchievements.find(a => a.id === 'nightmare_survivor');
    if (nightmareAchievement && !nightmareAchievement.unlocked) {
      const newProgress = nightmares;
      if (newProgress !== nightmareAchievement.progress) {
        nightmareAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= nightmareAchievement.requirement) {
          nightmareAchievement.unlocked = true;
          nightmareAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(nightmareAchievement);
        }
      }
    }

    // Check dream type diversity
    const uniqueDreamTypes = new Set(dreams.map(d => d.type)).size;
    const explorerAchievement = updatedAchievements.find(a => a.id === 'dream_explorer');
    if (explorerAchievement && !explorerAchievement.unlocked) {
      const newProgress = uniqueDreamTypes;
      if (newProgress !== explorerAchievement.progress) {
        explorerAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= explorerAchievement.requirement) {
          explorerAchievement.unlocked = true;
          explorerAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(explorerAchievement);
        }
      }
    }

    // Check high clarity dreams
    const highClarityDreams = dreams.filter(d => d.clarity === 5).length;
    const clarityAchievement = updatedAchievements.find(a => a.id === 'high_clarity');
    if (clarityAchievement && !clarityAchievement.unlocked) {
      const newProgress = highClarityDreams;
      if (newProgress !== clarityAchievement.progress) {
        clarityAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= clarityAchievement.requirement) {
          clarityAchievement.unlocked = true;
          clarityAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(clarityAchievement);
        }
      }
    }

    // Check perfect sleep quality
    const perfectSleepDreams = dreams.filter(d => d.sleepQuality === 5).length;
    const sleepAchievement = updatedAchievements.find(a => a.id === 'sleep_master');
    if (sleepAchievement && !sleepAchievement.unlocked) {
      const newProgress = perfectSleepDreams;
      if (newProgress !== sleepAchievement.progress) {
        sleepAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= sleepAchievement.requirement) {
          sleepAchievement.unlocked = true;
          sleepAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(sleepAchievement);
        }
      }
    }

    // Check unique tags
    const uniqueTags = new Set(dreams.flatMap(d => d.tags)).size;
    const tagAchievement = updatedAchievements.find(a => a.id === 'tag_collector');
    if (tagAchievement && !tagAchievement.unlocked) {
      const newProgress = uniqueTags;
      if (newProgress !== tagAchievement.progress) {
        tagAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= tagAchievement.requirement) {
          tagAchievement.unlocked = true;
          tagAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(tagAchievement);
        }
      }
    }

    // Check unique locations
    const uniqueLocations = new Set(dreams.map(d => d.location).filter(l => l)).size;
    const locationAchievement = updatedAchievements.find(a => a.id === 'location_traveler');
    if (locationAchievement && !locationAchievement.unlocked) {
      const newProgress = uniqueLocations;
      if (newProgress !== locationAchievement.progress) {
        locationAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= locationAchievement.requirement) {
          locationAchievement.unlocked = true;
          locationAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(locationAchievement);
        }
      }
    }

    // Check unique characters
    const uniqueCharacters = new Set(dreams.flatMap(d => d.characters)).size;
    const characterAchievement = updatedAchievements.find(a => a.id === 'character_social');
    if (characterAchievement && !characterAchievement.unlocked) {
      const newProgress = uniqueCharacters;
      if (newProgress !== characterAchievement.progress) {
        characterAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= characterAchievement.requirement) {
          characterAchievement.unlocked = true;
          characterAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(characterAchievement);
        }
      }
    }

    // Check emotional diversity
    const uniqueEmotionalStates = new Set([
      ...dreams.map(d => d.emotionalStateBefore),
      ...dreams.map(d => d.emotionalStateAfter),
    ]).size;
    const emotionalAchievement = updatedAchievements.find(a => a.id === 'emotional_balance');
    if (emotionalAchievement && !emotionalAchievement.unlocked) {
      const newProgress = uniqueEmotionalStates;
      if (newProgress !== emotionalAchievement.progress) {
        emotionalAchievement.progress = newProgress;
        hasChanges = true;
        if (newProgress >= emotionalAchievement.requirement) {
          emotionalAchievement.unlocked = true;
          emotionalAchievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(emotionalAchievement);
        }
      }
    }

    if (hasChanges) {
      setAchievements(updatedAchievements);
      await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updatedAchievements));

      // Show alerts for newly unlocked achievements
      newlyUnlocked.forEach(achievement => {
        Alert.alert(
          '🎉 Achievement Unlocked!',
          `${achievement.icon} ${achievement.title}\n${achievement.description}`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      });
    }
  }, [achievements, dreams, dreamStats]);

  const refreshAchievements = async () => {
    await loadAchievements();
    await checkAchievementProgress();
  };

  const unlockAchievement = async (id: AchievementId) => {
    const updated = achievements.map(a =>
      a.id === id && !a.unlocked
        ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
        : a
    );
    setAchievements(updated);
    await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated));
  };

  const updateProgress = async (id: AchievementId, progress: number) => {
    const updated = achievements.map(a => (a.id === id ? { ...a, progress } : a));
    setAchievements(updated);
    await AsyncStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated));
  };

  const achievementStats: AchievementStats = {
    totalUnlocked: achievements.filter(a => a.unlocked).length,
    totalAchievements: achievements.length,
    completionPercentage: Math.round(
      (achievements.filter(a => a.unlocked).length / achievements.length) * 100
    ),
    lastUnlocked: achievements
      .filter(a => a.unlocked && a.unlockedAt)
      .sort((a, b) => (b.unlockedAt! > a.unlockedAt! ? 1 : -1))[0],
    rarityCount: {
      common: achievements.filter(a => a.unlocked && a.rarity === 'common').length,
      rare: achievements.filter(a => a.unlocked && a.rarity === 'rare').length,
      epic: achievements.filter(a => a.unlocked && a.rarity === 'epic').length,
      legendary: achievements.filter(a => a.unlocked && a.rarity === 'legendary').length,
    },
  };

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        challenges,
        stats: achievementStats,
        loading,
        refreshAchievements,
        unlockAchievement,
        updateProgress,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
};

