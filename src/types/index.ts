export type TemperatureTolerance = 'cold-sensitive' | 'neutral' | 'heat-sensitive';

export interface WeatherData {
  city: string;
  avg: number;
  min: number;
  max: number;
  humidity: number;
  summary: string;
  rainChance?: number;
}

export interface PackingItem {
  name: string;
  count: number;
}

export interface TopsRecommendation {
  shortSleeve: number;
  longSleeve: number;
  total: number;
  note?: string;
}

export interface BottomsRecommendation {
  shorts: number;
  pants: number;
  total: number;
  note?: string;
}

export interface PackingList {
  tops: TopsRecommendation;
  bottoms: BottomsRecommendation;
  outerwear: PackingItem[];
  footwear: PackingItem[];
  accessories: string[];
}

export interface PackingPlan {
  weather: WeatherData;
  packing: PackingList;
  notes: string[];
}

export interface FormData {
  destination: string;
  startDate: string;
  endDate: string;
  tolerance: TemperatureTolerance;
} 