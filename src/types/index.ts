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

export interface PackingList {
  tops: number;
  bottoms: number;
  outerwear: string[];
  footwear: string[];
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