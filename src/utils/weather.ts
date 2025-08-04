import { WeatherData, PackingList, TemperatureTolerance, PackingPlan } from '@/types';

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

interface WeatherResponse {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    temperature_2m_min: string;
    precipitation_probability_max: string;
  };
}

export async function geocodeCity(cityName: string): Promise<GeocodingResult | null> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return null;
    }
    
    return data.results[0];
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

export async function getWeatherData(city: string, startDate: string, endDate: string): Promise<WeatherData> {
  try {
    // First, geocode the city name to get coordinates
    const geocoded = await geocodeCity(city);
    
    if (!geocoded) {
      throw new Error(`Could not find coordinates for "${city}"`);
    }
    
    // Check if dates are within Open-Meteo's allowed range (current limitation)
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const minDate = new Date('2025-05-03'); // Open-Meteo's minimum date
    const maxDate = new Date('2025-08-19'); // Open-Meteo's maximum date
    
    if (start < minDate || end > maxDate) {
      throw new Error(`Weather forecast is only available for dates between May 3, 2025 and August 19, 2025. Please adjust your travel dates.`);
    }
    
    // Fetch weather data from Open-Meteo
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${geocoded.latitude}&longitude=${geocoded.longitude}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.reason) {
        throw new Error(`Weather API: ${errorData.reason}`);
      }
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data: WeatherResponse = await response.json();
    
    // Check if we have valid temperature data
    const validTemps = data.daily.temperature_2m_max.filter(temp => temp !== null);
    if (validTemps.length === 0) {
      throw new Error(`No temperature data available for the selected dates. Please try dates within the next 16 days.`);
    }
    
    // Calculate averages and ranges (only for valid temperatures)
    const temps = data.daily.temperature_2m_max.map((max, i) => ({
      max: max,
      min: data.daily.temperature_2m_min[i]
    })).filter(temp => temp.max !== null && temp.min !== null);
    
    const avgTemp = temps.reduce((sum, temp) => sum + (temp.max + temp.min) / 2, 0) / temps.length;
    const minTemp = Math.min(...temps.map(t => t.min));
    const maxTemp = Math.max(...temps.map(t => t.max));
    const avgRainChance = data.daily.precipitation_probability_max.reduce((sum, chance) => sum + (chance || 0), 0) / data.daily.precipitation_probability_max.length;
    
    // Generate weather summary
    const summary = generateWeatherSummaryFromData(avgTemp, minTemp, maxTemp, avgRainChance);
    
    return {
      city: geocoded.name,
      avg: Math.round(avgTemp),
      min: Math.round(minTemp),
      max: Math.round(maxTemp),
      humidity: 65, // Open-Meteo doesn't provide humidity in daily forecast, using default
      summary,
      rainChance: Math.round(avgRainChance)
    };
  } catch (error) {
    console.error('Weather data fetch error:', error);
    throw error;
  }
}

function generateWeatherSummaryFromData(avg: number, min: number, max: number, rainChance: number): string {
  let summary = "";
  
  // Temperature description
  if (avg < 5) {
    summary = "Cold weather with freezing temperatures";
  } else if (avg < 15) {
    summary = "Cool weather, bring warm layers";
  } else if (avg < 25) {
    summary = "Mild weather, comfortable temperatures";
  } else if (avg < 35) {
    summary = "Warm weather, light clothing recommended";
  } else {
    summary = "Hot weather, stay cool and hydrated";
  }
  
  // Add temperature range info
  const range = max - min;
  if (range > 15) {
    summary += "; significant temperature swings between day and night";
  } else if (range > 8) {
    summary += "; moderate temperature variation";
  }
  
  // Add rain info
  if (rainChance > 70) {
    summary += ". High chance of rain, pack waterproof items";
  } else if (rainChance > 40) {
    summary += ". Moderate chance of rain, consider rain gear";
  } else if (rainChance > 20) {
    summary += ". Low chance of rain";
  }
  
  return summary;
}

export function calculatePackingList(
  weather: WeatherData,
  tolerance: TemperatureTolerance,
  startDate: string,
  endDate: string
): PackingList {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const tripDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Apply temperature tolerance modifier
  const getPerceivedTemp = (temp: number) => {
    switch (tolerance) {
      case 'cold-sensitive': return temp + 2;
      case 'heat-sensitive': return temp - 2;
      default: return temp;
    }
  };
  
  const perceivedAvg = getPerceivedTemp(weather.avg);
  const perceivedMin = getPerceivedTemp(weather.min);
  
  // Calculate base counts
  let tops = Math.ceil(tripDays / 2);
  if (tops < 2) tops = 2;
  
  // Add extra top for high humidity
  if (weather.humidity > 70 && perceivedAvg >= 24) {
    tops += Math.ceil(tripDays / 4);
  }
  
  let bottoms = Math.max(1, Math.floor(tripDays / 4)) + 1;
  
  // Determine outerwear based on temperature
  let outerwear: string[] = [];
  if (perceivedAvg < 8) {
    outerwear.push('heavy coat');
    if (perceivedMin < 5) outerwear.push('thermals');
  } else if (perceivedAvg < 14) {
    outerwear.push('light/heavy jacket');
  } else if (perceivedAvg < 20) {
    outerwear.push('light jacket');
  } else if (perceivedAvg < 26) {
    if (perceivedMin < 18) outerwear.push('light cardigan');
  }
  
  // Determine footwear
  let footwear: string[] = ['sneakers'];
  if (tripDays > 4 || perceivedAvg >= 24) {
    footwear.push('sandals');
  }
  
  // Determine accessories
  let accessories: string[] = [];
  if (weather.max >= 24) {
    accessories.push('sunglasses');
    accessories.push('hat');
  }
  if (weather.rainChance && weather.rainChance >= 40) {
    accessories.push('compact umbrella');
  }
  
  return {
    tops,
    bottoms,
    outerwear,
    footwear,
    accessories
  };
}

export function generateWeatherSummary(weather: WeatherData, tolerance: TemperatureTolerance): string {
  const getPerceivedTemp = (temp: number) => {
    switch (tolerance) {
      case 'cold-sensitive': return temp + 2;
      case 'heat-sensitive': return temp - 2;
      default: return temp;
    }
  };
  
  const perceivedAvg = getPerceivedTemp(weather.avg);
  const perceivedMin = getPerceivedTemp(weather.min);
  
  if (perceivedAvg < 8) {
    return "Cold conditions; heavy winter gear recommended.";
  } else if (perceivedAvg < 14) {
    return "Cool weather; layers and warm clothing needed.";
  } else if (perceivedAvg < 20) {
    return "Mild days, cooler evenings; light layers recommended.";
  } else if (perceivedAvg < 26) {
    return "Warm days, comfortable evenings; light clothing suitable.";
  } else {
    return "Hot weather; light, breathable clothing essential.";
  }
}

export function generateNotes(weather: WeatherData, tolerance: TemperatureTolerance): string[] {
  const notes: string[] = [];
  
  if (weather.humidity > 70) {
    notes.push("High humidity - breathable fabrics recommended");
  }
  
  if (weather.rainChance && weather.rainChance >= 40) {
    notes.push("Rain likely - pack waterproof items");
  }
  
  if (tolerance === 'cold-sensitive') {
    notes.push("Cold-sensitive - pack extra warm layers");
  } else if (tolerance === 'heat-sensitive') {
    notes.push("Heat-sensitive - prioritize cooling fabrics");
  }
  
  return notes;
} 