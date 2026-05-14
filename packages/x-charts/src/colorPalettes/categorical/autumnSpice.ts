import { type ChartsColorPaletteCallback } from '../types';

export const autumnSpicePaletteLight = [
  '#9C2A18',
  '#BD4C2D',
  '#DD6E42',
  '#E38B5F',
  '#E8A87C',
  '#D59A8C',
  '#C38D9E',
  '#A47287',
  '#85586F',
  '#634057',
  '#41273F',
  '#291730',
];
export const autumnSpicePaletteDark = [
  '#E07A5F',
  '#E98D6D',
  '#F2A07B',
  '#F3B18E',
  '#F4C2A1',
  '#E4B3AB',
  '#D4A5B5',
  '#BE92A4',
  '#A87F92',
  '#8A6479',
  '#6B4860',
  '#4E3447',
];

export const autumnSpicePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? autumnSpicePaletteDark : autumnSpicePaletteLight;
