import { type ChartsColorPaletteCallback } from '../types';

export const sunsetCoralPaletteLight = [
  '#FF6B6B',
  '#FF9A3C',
  '#FFC93C',
  '#C73E5C',
  '#8B1E3F',
  '#4A0E2C',
];
export const sunsetCoralPaletteDark = [
  '#FF8585',
  '#FFB266',
  '#FFD96B',
  '#E85A7C',
  '#B8365F',
  '#7A1E47',
];

export const sunsetCoralPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? sunsetCoralPaletteDark : sunsetCoralPaletteLight;