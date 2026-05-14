import { type ChartsColorPaletteCallback } from '../types';

export const neonCyberPaletteLight = [
  '#F72585',
  '#B5179E',
  '#7209B7',
  '#560BAD',
  '#3A0CA3',
  '#3F37C9',
  '#4361EE',
  '#4895EF',
  '#4CC9F0',
  '#2966BE',
  '#06038D',
  '#030254',
];
export const neonCyberPaletteDark = [
  '#FF4D9F',
  '#CE4DBE',
  '#9D4EDD',
  '#7B33BC',
  '#5A189A',
  '#5C4DC7',
  '#5E81F4',
  '#68B0F5',
  '#72DEF5',
  '#569AF5',
  '#3A56F5',
  '#2238D4',
];

export const neonCyberPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? neonCyberPaletteDark : neonCyberPaletteLight;
