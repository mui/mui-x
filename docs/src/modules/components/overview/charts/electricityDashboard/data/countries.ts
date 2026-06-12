import type { CountryMetadata } from '../types/electricity';

export const COUNTRIES: CountryMetadata[] = [
  { code: 'BEL', name: 'Belgium' },
  { code: 'CHE', name: 'Switzerland' },
  { code: 'DEU', name: 'Germany' },
  { code: 'DNK', name: 'Denmark' },
  { code: 'ESP', name: 'Spain' },
  { code: 'FRA', name: 'France' },
  { code: 'ITA', name: 'Italy' },
  { code: 'NOR', name: 'Norway' },
  { code: 'POL', name: 'Poland' },
  { code: 'PRT', name: 'Portugal' },
  { code: 'SWE', name: 'Sweden' },
];

export const COUNTRY_NAMES: Record<string, string> = Object.fromEntries(
  COUNTRIES.map((c) => [c.code, c.name]),
);
