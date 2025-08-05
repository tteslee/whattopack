import { WeatherData, PackingList, PackingItem, TemperatureTolerance, PackingPlan } from '@/types';

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
  const perceivedMax = getPerceivedTemp(weather.max);
  
  // Calculate base tops: 1 per day, minimum 1
  let baseTops = Math.max(1, tripDays);
  let topsNote = '';
  
  // Weather adjustments for tops
  if (perceivedAvg >= 24) {
    // Hot weather - need extra tops due to sweating
    if (tripDays <= 3) {
      baseTops += 1; // Add 1 extra for short trips
    } else if (tripDays <= 7) {
      baseTops += 2; // Add 2 extra for medium trips
    } else {
      baseTops += 3; // Add 3 extra for long trips
    }
    topsNote = 'Extra tops recommended due to hot weather and sweating.';
  } else if (perceivedAvg <= 5) {
    // Cold weather - need extra tops for layering
    baseTops += 1;
    topsNote = 'Extra top recommended for layering in cold weather.';
  }
  
  // Rain adjustments
  if (weather.rainChance && weather.rainChance >= 60) {
    // High chance of rain - might need extra tops if clothes get wet
    baseTops += 1;
    topsNote = topsNote ? topsNote + ' Extra top for potential rain.' : 'Extra top recommended due to high chance of rain.';
  }
  
  // Cap at reasonable maximum
  const totalTops = Math.min(baseTops, 8);
  
  // Calculate tops breakdown based on temperature
  let shortSleeve = 0;
  let longSleeve = 0;
  
  if (perceivedAvg >= 22) {
    // Warm weather - mostly short sleeve
    shortSleeve = Math.ceil(totalTops * 0.8);
    longSleeve = Math.max(1, totalTops - shortSleeve);
  } else if (perceivedAvg >= 15) {
    // Mild weather - mix of both
    shortSleeve = Math.ceil(totalTops * 0.6);
    longSleeve = totalTops - shortSleeve;
  } else {
    // Cool weather - mostly long sleeve
    longSleeve = Math.ceil(totalTops * 0.8);
    shortSleeve = Math.max(1, totalTops - longSleeve);
  }
  
  // Calculate base bottoms: consider weather and trip duration
  let baseBottoms = Math.max(1, Math.ceil(tripDays / 2)); // 1 per 2 days, minimum 1
  let bottomsNote = '';
  
  // Weather adjustments for bottoms
  if (perceivedAvg >= 26) {
    // Hot weather - might need extra bottoms due to sweating
    baseBottoms = Math.min(baseBottoms + 1, 6);
    bottomsNote = 'Extra bottoms recommended due to hot weather and sweating.';
  }
  
  // Rain adjustments for bottoms
  if (weather.rainChance && weather.rainChance >= 60) {
    // High chance of rain - might need extra bottoms
    baseBottoms = Math.min(baseBottoms + 1, 6);
    bottomsNote = bottomsNote ? bottomsNote + ' Extra bottoms for potential rain.' : 'Extra bottoms recommended due to high chance of rain.';
  }
  
  // Cap at reasonable maximum
  const totalBottoms = Math.min(baseBottoms, 6);
  
  // Calculate bottoms breakdown based on temperature
  let shorts = 0;
  let pants = 0;
  
  if (perceivedAvg >= 24) {
    // Hot weather - mostly shorts
    shorts = Math.ceil(totalBottoms * 0.7);
    pants = Math.max(1, totalBottoms - shorts);
  } else if (perceivedAvg >= 18) {
    // Mild weather - mix of both
    shorts = Math.ceil(totalBottoms * 0.4);
    pants = totalBottoms - shorts;
  } else {
    // Cool weather - mostly pants
    pants = Math.ceil(totalBottoms * 0.8);
    shorts = Math.max(1, totalBottoms - pants);
  }
  
  // Determine outerwear with quantities based on weather
  let outerwear: PackingItem[] = [];
  
  if (perceivedAvg < 5) {
    // Very cold weather
    outerwear.push({ name: 'heavy coat', count: 1 });
    if (perceivedMin < 0) {
      outerwear.push({ name: 'thermals', count: Math.max(1, Math.ceil(tripDays / 2)) });
    }
  } else if (perceivedAvg < 10) {
    // Cold weather
    outerwear.push({ name: 'heavy coat', count: 1 });
    if (tripDays > 3) {
      outerwear.push({ name: 'thermals', count: 1 });
    }
  } else if (perceivedAvg < 15) {
    // Cool weather
    outerwear.push({ name: 'light/heavy jacket', count: 1 });
  } else if (perceivedAvg < 20) {
    // Mild weather
    outerwear.push({ name: 'light jacket', count: 1 });
  } else if (perceivedAvg < 25) {
    // Warm weather with cool evenings
    if (perceivedMin < 18) {
      outerwear.push({ name: 'light cardigan', count: 1 });
    }
  }
  
  // Rain considerations for outerwear
  if (weather.rainChance && weather.rainChance >= 40) {
    // Add rain protection if not already covered by outerwear
    const hasRainProtection = outerwear.some(item => 
      item.name.includes('coat') || item.name.includes('jacket')
    );
    if (!hasRainProtection) {
      outerwear.push({ name: 'rain jacket', count: 1 });
    }
  }
  
  // Determine footwear with quantities based on weather and trip duration
  let footwear: PackingItem[] = [{ name: 'sneakers', count: 1 }];
  
  // Add sandals for hot weather or longer trips
  if (perceivedAvg >= 24 || tripDays > 4) {
    footwear.push({ name: 'sandals', count: 1 });
  }
  
  // Add boots for cold/rainy weather
  if (perceivedAvg < 10 || (weather.rainChance && weather.rainChance >= 60)) {
    footwear.push({ name: 'boots', count: 1 });
  }
  
  // Determine accessories based on weather
  let accessories: string[] = [];
  
  if (perceivedMax >= 24) {
    accessories.push('sunglasses');
    accessories.push('hat');
  }
  
  if (perceivedAvg < 15) {
    accessories.push('scarf');
    accessories.push('gloves');
  }
  
  if (weather.rainChance && weather.rainChance >= 40) {
    accessories.push('compact umbrella');
  }
  
  if (weather.humidity > 70 && perceivedAvg >= 20) {
    accessories.push('moisture-wicking socks');
  }
  
  return {
    tops: {
      shortSleeve,
      longSleeve,
      total: shortSleeve + longSleeve,
      note: topsNote || undefined
    },
    bottoms: {
      shorts,
      pants,
      total: shorts + pants,
      note: bottomsNote || undefined
    },
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