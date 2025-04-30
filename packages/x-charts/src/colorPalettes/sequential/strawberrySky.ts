import { ChartsColorPaletteCallback } from '../types';

export const strawberrySkyPaletteLight = [
  '#6877FF',
  '#694FFD',
  '#A94FFD',
  '#DA4FFD',
  '#F050A5',
  '#FF5E6C',
];
export const strawberrySkyPaletteDark = strawberrySkyPaletteLight;

export const strawberrySkyPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? strawberrySkyPaletteDark : strawberrySkyPaletteLight;
