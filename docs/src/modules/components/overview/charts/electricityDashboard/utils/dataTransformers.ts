import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import type { CountryStats, ChartDataPoint, FilteredData } from '../types/electricity';
import { COUNTRIES, COUNTRY_NAMES } from '../data/countries';

const START_OF_2024 = dayjs('2024-01-01T00:00:00');

/**
 * Convert a date to an hour index (0-8759) for 2024
 */
export function getHourIndex(date: Dayjs): number {
  return date.diff(START_OF_2024, 'hour');
}

/**
 * Convert an hour index back to a Date object
 */
export function hourIndexToDate(index: number): Date {
  return START_OF_2024.add(index, 'hour').toDate();
}

/**
 * Calculate statistics for an array of numbers
 */
export function calculateStats(data: readonly number[]): {
  avg: number;
  min: number;
  max: number;
  total: number;
} {
  
  const { total, min, max } = data.reduce(
    (acc, val) => ({
      total: acc.total + val,
      min: Math.min(acc.min, val),
      max: Math.max(acc.max, val),
    }),
    { total: 0, min: Infinity, max: -Infinity },
  );
  return {
    avg: data.length > 0 ? total / data.length : 0,
    min: data.length > 0 ? min : 0,
    max: data.length > 0 ? max : 0,
    total,
  };
}

/**
 * Downsample an array to a target length by averaging
 */
export function downsample(data: readonly number[], targetLength: number): number[] {
  if (data.length <= targetLength) {
    return [...data];
  }
  const step = data.length / targetLength;
  const result: number[] = [];
  for (let i = 0; i < targetLength; i += 1) {
    const start = Math.floor(i * step);
    const end = Math.floor((i + 1) * step);
    const slice = data.slice(start, end);
    const avg = slice.reduce((sum, val) => sum + val, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

/**
 * Filter and transform data based on date range
 */
export function filterAndTransformData(
  generationData: Record<string, readonly number[]>,
  emissionsData: Record<string, readonly number[]>,
  startDate: Dayjs | null,
  endDate: Dayjs | null,
): FilteredData {
  const startIndex = startDate ? Math.max(0, getHourIndex(startDate)) : 0;
  const endIndex = endDate ? Math.min(8759, getHourIndex(endDate)) : 8759;

  const chartData: ChartDataPoint[] = [];
  const countryStats: CountryStats[] = [];

  // Sample rate for chart data (every N hours) to avoid too many points
  const totalHours = endIndex - startIndex + 1;
  const sampleRate = Math.max(1, Math.floor(totalHours / 200));

  // Build chart data points
  for (let i = startIndex; i <= endIndex; i += sampleRate) {
    const point: ChartDataPoint = { date: hourIndexToDate(i) };
    COUNTRIES.forEach((country) => {
      point[`${country.code}_gen`] = generationData[country.code]?.[i] ?? 0;
      point[`${country.code}_co2`] = emissionsData[country.code]?.[i] ?? 0;
    });
    chartData.push(point);
  }

  // Calculate per-country stats
  let totalGenerationSum = 0;
  let weightedEmissionsSum = 0;
  let totalGenerationForWeighting = 0;

  COUNTRIES.forEach((country) => {
    const genSlice = generationData[country.code]?.slice(startIndex, endIndex + 1) ?? [];
    const emSlice = emissionsData[country.code]?.slice(startIndex, endIndex + 1) ?? [];

    const genStats = calculateStats(genSlice);
    const emStats = calculateStats(emSlice);

    countryStats.push({
      code: country.code,
      name: COUNTRY_NAMES[country.code],
      avgGeneration: genStats.avg,
      avgEmissions: emStats.avg,
      totalGeneration: genStats.total,
      generationTrend: downsample(genSlice, 24),
      emissionsTrend: downsample(emSlice, 24),
    });

    totalGenerationSum += genStats.total;
    weightedEmissionsSum += emStats.avg * genStats.total;
    totalGenerationForWeighting += genStats.total;
  });

  // Calculate totals
  const totalGenerationTrend: number[] = [];
  const totalEmissionsTrend: number[] = [];

  for (let i = startIndex; i <= endIndex; i += Math.max(1, Math.floor(totalHours / 24))) {
    let genSum = 0;
    let emSum = 0;
    let count = 0;
    COUNTRIES.forEach((country) => {
      genSum += generationData[country.code]?.[i] ?? 0;
      emSum += emissionsData[country.code]?.[i] ?? 0;
      count += 1;
    });
    totalGenerationTrend.push(genSum);
    totalEmissionsTrend.push(count > 0 ? emSum / count : 0);
  }

  const cleanestCountry = countryStats.reduce((min, c) =>
    c.avgEmissions < min.avgEmissions ? c : min,
  );

  return {
    chartData,
    countryStats,
    totals: {
      avgGeneration: totalGenerationSum / (totalHours * COUNTRIES.length),
      avgEmissions:
        totalGenerationForWeighting > 0 ? weightedEmissionsSum / totalGenerationForWeighting : 0,
      totalGeneration: totalGenerationSum,
      generationTrend: downsample(totalGenerationTrend, 24),
      emissionsTrend: downsample(totalEmissionsTrend, 24),
    },
    cleanestCountry,
  };
}
