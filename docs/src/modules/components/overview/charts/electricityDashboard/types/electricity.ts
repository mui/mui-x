import type { Dayjs } from 'dayjs';

export type DateRange = [Dayjs | null, Dayjs | null];

export interface CountryMetadata {
  code: string;
  name: string;
}

export interface CountryStats {
  code: string;
  name: string;
  avgGeneration: number;
  avgEmissions: number;
  totalGeneration: number;
  generationTrend: number[];
  emissionsTrend: number[];
}

export interface ChartDataPoint {
  date: Date;
  [countryCode: string]: number | Date;
}

export interface FilteredData {
  chartData: ChartDataPoint[];
  countryStats: CountryStats[];
  totals: {
    avgGeneration: number;
    avgEmissions: number;
    totalGeneration: number;
    generationTrend: number[];
    emissionsTrend: number[];
    trendDates: Date[];
  };
  cleanestCountry: CountryStats | null;
}
