export interface MoonPhase {
  time: string;
  text: string;
  value: number;
}

export interface AstronomyData {
  time: string;
  astronomicalDawn: string | null;
  astronomicalDusk: string | null;
  civilDawn: string | null;
  civilDusk: string | null;
  moonFraction: number;
  moonPhase: {
    closest: MoonPhase;
    current: MoonPhase;
  };
  moonrise: string | null;
  moonset: string | null;
  nauticalDawn: string | null;
  nauticalDusk: string | null;
  sunrise: string | null;
  sunset: string | null;
}

export interface AstronomyResponse {
  data: AstronomyData[];
  meta: {
    cost: number;
    dailyQuota: number;
    lat: number;
    lng: number;
    requestCount: number;
    start: string;
  };
}

export interface DreamForecast {
  date: string;
  moonPhase: MoonPhase;
  moonFraction: number;
  dreamType: string;
  intensity: number;
  clarity: number;
  prediction: string;
  emotionalTone: string;
  lucidProbability: number;
}

export interface CachedAstronomyData {
  data: AstronomyData;
  timestamp: number;
  date: string;
}

