'use server';

import { z } from 'zod';
import { getWeatherData, calculatePackingList, generateWeatherSummary, generateNotes } from '@/utils/weather';
import { checkRateLimit } from '@/utils/rateLimit';
import { PackingPlan, TemperatureTolerance } from '@/types';

const formSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  tolerance: z.enum(['cold-sensitive', 'neutral', 'heat-sensitive'] as const),
});

export async function getPlan(formData: FormData): Promise<{ success: true; data: PackingPlan } | { success: false; error: string }> {
  try {
    // Rate limiting (simple IP-based for now)
    const clientIp = 'default'; // In production, get from headers
    if (!checkRateLimit(clientIp, 30, 600000)) { // 30 requests per 10 minutes
      return { success: false, error: 'Too many requests. Please try again later.' };
    }

    // Validate form data
    const validatedData = formSchema.parse({
      destination: formData.get('destination'),
      startDate: formData.get('startDate'),
      endDate: formData.get('endDate'),
      tolerance: formData.get('tolerance'),
    });

    // Validate dates
    const startDate = new Date(validatedData.startDate);
    const endDate = new Date(validatedData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      return { success: false, error: 'Start date cannot be in the past' };
    }

    if (endDate < startDate) {
      return { success: false, error: 'End date must be after start date' };
    }

    // Get weather data
    const weather = await getWeatherData(
      validatedData.destination,
      validatedData.startDate,
      validatedData.endDate
    );

    // Calculate packing list
    const packing = calculatePackingList(
      weather,
      validatedData.tolerance,
      validatedData.startDate,
      validatedData.endDate
    );

    // Generate summary and notes
    weather.summary = generateWeatherSummary(weather, validatedData.tolerance);
    const notes = generateNotes(weather, validatedData.tolerance);

    const plan: PackingPlan = {
      weather,
      packing,
      notes,
    };

    return { success: true, data: plan };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    
    console.error('Error generating packing plan:', error);
    return { success: false, error: 'Failed to generate packing plan. Please try again.' };
  }
} 