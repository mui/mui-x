import { type ChartsColorPaletteCallback } from '../types';

export const candyPopPaletteLight = [
  '#FF006E',
  '#FB5607',
  '#FFBE0B',
  '#8338EC',
  '#3A86FF',
  '#06AED5',
];
export const candyPopPaletteDark = [
  '#FF4D94',
  '#FF7A3D',
  '#FFD03D',
  '#A66BFF',
  '#66A6FF',
  '#3DC9E8',
];

export const candyPopPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? candyPopPaletteDark : candyPopPaletteLight;
