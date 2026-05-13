import { type ChartsColorPaletteCallback } from '../types';

export const desertDunePaletteLight = [
  '#E76F51',
  '#F4A261',
  '#E9C46A',
  '#2A9D8F',
  '#264653',
  '#1A2D36',
];
export const desertDunePaletteDark = [
  '#F4886B',
  '#F7B57E',
  '#F0D188',
  '#4FBDAE',
  '#3D6B7C',
  '#2A4A5A',
];

export const desertDunePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? desertDunePaletteDark : desertDunePaletteLight;