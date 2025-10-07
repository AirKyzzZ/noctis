import { AstronomyData, DreamForecast, MoonPhase } from '../types/astronomy';
import { DreamType, OverallTone } from '../types/dream';

/**
 * Generate a seeded random number based on date and moon phase
 * This ensures the same "prediction" for the same date
 */
const seededRandom = (seed: number): number => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

/**
 * Get a deterministic seed from a date string
 */
const getDateSeed = (dateStr: string): number => {
  const date = new Date(dateStr);
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
};

/**
 * Map moon phase value to dream characteristics
 */
const getMoonInfluence = (moonPhaseValue: number, moonFraction: number) => {
  // Moon phase: 0/1 = New, 0.25 = First Quarter, 0.5 = Full, 0.75 = Third Quarter
  
  let dreamTypeWeights: Record<DreamType, number>;
  let intensityModifier: number;
  let clarityModifier: number;
  let lucidModifier: number;
  let emotionalToneWeights: Record<OverallTone, number>;

  if (moonPhaseValue < 0.125 || moonPhaseValue > 0.875) {
    // New Moon - introspective, subtle dreams
    dreamTypeWeights = {
      ordinary: 0.3,
      lucid: 0.05,
      nightmare: 0.1,
      recurring: 0.15,
      prophetic: 0.25,
      healing: 0.15,
    };
    intensityModifier = -0.2;
    clarityModifier = -0.3;
    lucidModifier = 0.1;
    emotionalToneWeights = { positive: 0.2, negative: 0.2, neutral: 0.5, mixed: 0.1 };
  } else if (moonPhaseValue >= 0.125 && moonPhaseValue < 0.375) {
    // Waxing (First Quarter) - creative, building energy
    dreamTypeWeights = {
      ordinary: 0.25,
      lucid: 0.2,
      nightmare: 0.05,
      recurring: 0.1,
      prophetic: 0.15,
      healing: 0.25,
    };
    intensityModifier = 0.1;
    clarityModifier = 0.2;
    lucidModifier = 0.3;
    emotionalToneWeights = { positive: 0.5, negative: 0.1, neutral: 0.2, mixed: 0.2 };
  } else if (moonPhaseValue >= 0.375 && moonPhaseValue < 0.625) {
    // Full Moon - intense, vivid dreams
    dreamTypeWeights = {
      ordinary: 0.15,
      lucid: 0.25,
      nightmare: 0.2,
      recurring: 0.1,
      prophetic: 0.2,
      healing: 0.1,
    };
    intensityModifier = 0.4;
    clarityModifier = 0.4;
    lucidModifier = 0.4;
    emotionalToneWeights = { positive: 0.25, negative: 0.25, neutral: 0.1, mixed: 0.4 };
  } else {
    // Waning (Third Quarter) - reflective, releasing dreams
    dreamTypeWeights = {
      ordinary: 0.2,
      lucid: 0.15,
      nightmare: 0.15,
      recurring: 0.2,
      prophetic: 0.1,
      healing: 0.2,
    };
    intensityModifier = 0;
    clarityModifier = 0.1;
    lucidModifier = 0.2;
    emotionalToneWeights = { positive: 0.3, negative: 0.3, neutral: 0.25, mixed: 0.15 };
  }

  return {
    dreamTypeWeights,
    intensityModifier,
    clarityModifier,
    lucidModifier,
    emotionalToneWeights,
  };
};

/**
 * Pick a weighted random item from an object of weights
 */
const weightedRandom = <T extends string>(
  weights: Record<T, number>,
  random: number
): T => {
  const totalWeight = Object.values(weights).reduce((sum: number, weight) => sum + (weight as number), 0);
  let randomValue = random * (totalWeight as number);
  
  for (const [key, weight] of Object.entries(weights) as [T, number][]) {
    randomValue -= weight;
    if (randomValue <= 0) {
      return key;
    }
  }
  
  return Object.keys(weights)[0] as T;
};

/**
 * Generate dream type descriptions based on moon phase
 */
const getDreamPredictionText = (
  dreamType: DreamType,
  moonPhase: MoonPhase,
  intensity: number,
  emotionalTone: OverallTone
): string => {
  const moonPhaseText = moonPhase.text.toLowerCase();
  
  const predictions: Record<DreamType, string[]> = {
    ordinary: [
      `Under the ${moonPhaseText}, your dreams will reflect everyday experiences with gentle insights.`,
      `The ${moonPhaseText} brings calm, familiar dreamscapes from your daily life.`,
      `Expect peaceful dreams of ordinary moments, illuminated by the ${moonPhaseText}.`,
    ],
    lucid: [
      `The ${moonPhaseText} awakens your awareness—you may realize you're dreaming tonight.`,
      `High lucidity potential under the ${moonPhaseText}. Reality checks recommended.`,
      `The cosmic alignment favors conscious dreaming. The ${moonPhaseText} empowers your dream control.`,
    ],
    nightmare: [
      `The ${moonPhaseText} may stir challenging dreams. Remember, they often bring important messages.`,
      `Intense dream energy tonight. The ${moonPhaseText} can surface fears for healing.`,
      `Shadow work is highlighted under the ${moonPhaseText}. Face your dreams with courage.`,
    ],
    recurring: [
      `A familiar dream may return under the ${moonPhaseText}, offering new layers of meaning.`,
      `The ${moonPhaseText} cycles bring recurring themes. Pay attention to patterns.`,
      `Déjà rêvé—the ${moonPhaseText} may replay dreams with fresh perspectives.`,
    ],
    prophetic: [
      `The ${moonPhaseText} opens pathways to future insights. Keep a dream journal ready.`,
      `Prophetic visions are favored tonight. The ${moonPhaseText} thins the veil between times.`,
      `Your subconscious may glimpse tomorrow under the ${moonPhaseText}'s mystical influence.`,
    ],
    healing: [
      `The ${moonPhaseText} brings restorative dream energy. Expect emotional processing and release.`,
      `Healing dreams are likely tonight. The ${moonPhaseText} supports inner transformation.`,
      `The cosmic energy of the ${moonPhaseText} promotes therapeutic dreamwork and renewal.`,
    ],
  };

  const options = predictions[dreamType];
  const seed = getDateSeed(moonPhase.time);
  const randomIndex = Math.floor(seededRandom(seed) * options.length);
  
  return options[randomIndex];
};

/**
 * Generate emotional state prediction
 */
const predictEmotionalTone = (
  tone: OverallTone,
  moonPhase: MoonPhase
): string => {
  const descriptions: Record<OverallTone, string[]> = {
    positive: ['uplifting', 'joyful', 'inspiring', 'hopeful', 'peaceful'],
    negative: ['challenging', 'intense', 'cathartic', 'transformative', 'deep'],
    neutral: ['balanced', 'observant', 'contemplative', 'steady', 'curious'],
    mixed: ['dynamic', 'complex', 'multifaceted', 'rich', 'varied'],
  };

  const seed = getDateSeed(moonPhase.time);
  const options = descriptions[tone];
  const randomIndex = Math.floor(seededRandom(seed + 1) * options.length);
  
  return options[randomIndex];
};

/**
 * Main function to generate dream forecast from astronomy data
 */
export const generateDreamForecast = (astronomyData: AstronomyData): DreamForecast => {
  const { moonPhase, moonFraction, time } = astronomyData;
  const currentPhase = moonPhase.current;
  
  // Get moon influence on dream characteristics
  const influence = getMoonInfluence(currentPhase.value, moonFraction);
  
  // Generate deterministic random values based on date
  const dateSeed = getDateSeed(time);
  const random1 = seededRandom(dateSeed);
  const random2 = seededRandom(dateSeed + 1000);
  const random3 = seededRandom(dateSeed + 2000);
  const random4 = seededRandom(dateSeed + 3000);
  
  // Determine dream type
  const dreamType = weightedRandom(influence.dreamTypeWeights, random1);
  
  // Calculate intensity (1-5 scale)
  const baseIntensity = 3;
  const intensity = Math.max(
    1,
    Math.min(5, Math.round(baseIntensity + influence.intensityModifier * 5 + (random2 - 0.5)))
  );
  
  // Calculate clarity (1-5 scale)
  const baseClarity = 3;
  const clarity = Math.max(
    1,
    Math.min(5, Math.round(baseClarity + influence.clarityModifier * 5 + (random3 - 0.5)))
  );
  
  // Calculate lucid probability (0-100%)
  const baseLucidProbability = 20;
  const lucidProbability = Math.max(
    0,
    Math.min(100, Math.round(baseLucidProbability + influence.lucidModifier * 100 + (random4 - 0.5) * 20))
  );
  
  // Determine emotional tone
  const emotionalTone = weightedRandom(influence.emotionalToneWeights, random2);
  const emotionalDescription = predictEmotionalTone(emotionalTone, currentPhase);
  
  // Generate prediction text
  const prediction = getDreamPredictionText(dreamType, currentPhase, intensity, emotionalTone);

  return {
    date: time,
    moonPhase: currentPhase,
    moonFraction,
    dreamType,
    intensity,
    clarity,
    prediction,
    emotionalTone: emotionalDescription,
    lucidProbability,
  };
};

/**
 * Get dream type label in English
 */
export const getDreamTypeLabel = (dreamType: DreamType): string => {
  const labels: Record<DreamType, string> = {
    ordinary: 'Ordinary',
    lucid: 'Lucid',
    nightmare: 'Nightmare',
    recurring: 'Recurring',
    prophetic: 'Prophetic',
    healing: 'Healing',
  };
  return labels[dreamType];
};

/**
 * Get moon phase emoji
 */
export const getMoonPhaseEmoji = (moonPhaseValue: number): string => {
  if (moonPhaseValue < 0.0625 || moonPhaseValue >= 0.9375) return '🌑'; // New Moon
  if (moonPhaseValue < 0.1875) return '🌒'; // Waxing Crescent
  if (moonPhaseValue < 0.3125) return '🌓'; // First Quarter
  if (moonPhaseValue < 0.4375) return '🌔'; // Waxing Gibbous
  if (moonPhaseValue < 0.5625) return '🌕'; // Full Moon
  if (moonPhaseValue < 0.6875) return '🌖'; // Waning Gibbous
  if (moonPhaseValue < 0.8125) return '🌗'; // Third Quarter
  return '🌘'; // Waning Crescent
};

