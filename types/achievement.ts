export type AchievementCategory = 'streak' | 'dream_type' | 'quantity' | 'quality' | 'exploration';

export type AchievementId =
  // Streak achievements
  | 'first_dream'
  | 'streak_3'
  | 'streak_7'
  | 'streak_14'
  | 'streak_30'
  | 'streak_100'
  // Dream type achievements
  | 'first_lucid'
  | 'lucid_master'
  | 'nightmare_survivor'
  | 'dream_explorer'
  // Quantity achievements
  | 'dreams_10'
  | 'dreams_50'
  | 'dreams_100'
  | 'dreams_365'
  // Quality achievements
  | 'high_clarity'
  | 'sleep_master'
  | 'emotional_balance'
  // Exploration achievements
  | 'tag_collector'
  | 'location_traveler'
  | 'character_social';

export interface Achievement {
  id: AchievementId;
  title: string;
  description: string;
  icon: string; // emoji
  category: AchievementCategory;
  requirement: number; // The threshold to unlock
  progress: number; // Current progress
  unlocked: boolean;
  unlockedAt?: string; // ISO string
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  progress: number;
  completed: boolean;
  completedAt?: string;
  expiresAt?: string; // For time-limited challenges
  reward?: string; // Achievement ID or special reward
}

export interface AchievementStats {
  totalUnlocked: number;
  totalAchievements: number;
  completionPercentage: number;
  lastUnlocked?: Achievement;
  rarityCount: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };
}

