export type DreamType = 
  | 'ordinary'
  | 'lucid'
  | 'nightmare'
  | 'recurring'
  | 'prophetic'
  | 'healing';

export type EmotionalState = 
  | 'calm'
  | 'anxious'
  | 'excited'
  | 'sad'
  | 'happy'
  | 'fearful'
  | 'peaceful'
  | 'restless';

export type OverallTone = 'positive' | 'negative' | 'neutral' | 'mixed';

export type SleepQuality = 1 | 2 | 3 | 4 | 5;

export type EmotionalIntensity = 1 | 2 | 3 | 4 | 5;

export type DreamClarity = 1 | 2 | 3 | 4 | 5;

export type LucidDreamTechnique = 
  | 'MILD' // Mnemonic Induction of Lucid Dreams
  | 'WBTB' // Wake Back To Bed
  | 'FILD' // Finger Induced Lucid Dream
  | 'WILD' // Wake Initiated Lucid Dream
  | 'DILD' // Dream Initiated Lucid Dream
  | 'SSILD' // Senses Initiated Lucid Dream
  | 'CAT' // Cycle Adjustment Technique
  | 'DEILD' // Dream Exit Induced Lucid Dream
  | 'Reality Check'
  | 'Other';

export interface Dream {
  id: string;
  dateTime: string; // ISO string
  type: DreamType;
  emotionalStateBefore: EmotionalState;
  emotionalStateAfter: EmotionalState;
  characters: string[]; // Array of character names/descriptions
  location: string;
  emotionalIntensity: EmotionalIntensity;
  clarity: DreamClarity;
  tags: string[]; // Keywords
  sleepQuality: SleepQuality;
  personalMeaning: string;
  overallTone: OverallTone;
  description: string; // Full dream description
  lucidTechniques?: LucidDreamTechnique[]; // Optional: techniques used for lucid dreaming
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface DreamStats {
  totalDreams: number;
  currentStreak: number;
  longestStreak: number;
  lastDreamDate: string | null;
  dreamTypeDistribution: Record<DreamType, number>;
  averageSleepQuality: number;
  averageClarity: number;
}

