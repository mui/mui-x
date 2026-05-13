import { type ChartsColorPaletteCallback } from '../types';

export const autumnSpicePaletteLight = [
  '#9C2A18',
  '#DD6E42',
  '#E8A87C',
  '#C38D9E',
  '#85586F',
  '#41273F',
];
export const autumnSpicePaletteDark = [
  '#E07A5F',
  '#F2A07B',
  '#F4C2A1',
  '#D4A5B5',
  '#A87F92',
  '#6B4860',
];

export const autumnSpicePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? autumnSpicePaletteDark : autumnSpicePaletteLight;
