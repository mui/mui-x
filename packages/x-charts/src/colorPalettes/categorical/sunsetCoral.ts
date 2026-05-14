import { type ChartsColorPaletteCallback } from '../types';

export const sunsetCoralPaletteLight = [
  '#FF6B6B',
  '#FF8253',
  '#FF9A3C',
  '#FFB13C',
  '#FFC93C',
  '#E48349',
  '#C73E5C',
  '#A92E4E',
  '#8B1E3F',
  '#6B1635',
  '#4A0E2C',
  '#2D081B',
];
export const sunsetCoralPaletteDark = [
  '#FF8585',
  '#FF9C76',
  '#FFB266',
  '#FFC669',
  '#FFD96B',
  '#F49974',
  '#E85A7C',
  '#D0486E',
  '#B8365F',
  '#992A53',
  '#7A1E47',
  '#591435',
];

export const sunsetCoralPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? sunsetCoralPaletteDark : sunsetCoralPaletteLight;
