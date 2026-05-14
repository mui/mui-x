import { type ChartsColorPaletteCallback } from '../types';

export const candyPopPaletteLight = [
  '#FF006E',
  '#FD2B3A',
  '#FB5607',
  '#FD8A09',
  '#FFBE0B',
  '#C97B7B',
  '#8338EC',
  '#5E5FFB',
  '#3A86FF',
  '#209AEA',
  '#06AED5',
  '#039DBE',
];
export const candyPopPaletteDark = [
  '#FF4D94',
  '#FF6469',
  '#FF7A3D',
  '#FFA53D',
  '#FFD03D',
  '#D39E6E',
  '#A66BFF',
  '#8689FF',
  '#66A6FF',
  '#52B8F4',
  '#3DC9E8',
  '#36BBD7',
];

export const candyPopPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? candyPopPaletteDark : candyPopPaletteLight;
