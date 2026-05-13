import { type ChartsColorPaletteCallback } from '../types';

export const signalDuoPaletteLight = [
  '#16A34A',
  '#DC2626',
  '#2563EB',
  '#F59E0B',
  '#7C3AED',
  '#0F766E',
];
export const signalDuoPaletteDark = [
  '#4ADE80',
  '#F87171',
  '#60A5FA',
  '#FBBF24',
  '#A78BFA',
  '#2DD4BF',
];

export const signalDuoPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? signalDuoPaletteDark : signalDuoPaletteLight;
