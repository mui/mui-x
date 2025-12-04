// Red sequential gradient palette based on the color scheme
import { ChartsColorPaletteCallback } from '../types';

export const redPaletteLight = [
  '#FAE0E0',
  '#F7C0BF',
  '#F3A2A0',
  '#EF5350',
  '#E53935',
  '#DC2B27',
  '#860B08',
  '#560503 ',
];
export const redPaletteDark = redPaletteLight;

export const redPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? redPaletteDark : redPaletteLight;
