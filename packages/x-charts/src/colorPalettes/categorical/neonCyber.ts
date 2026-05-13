import { type ChartsColorPaletteCallback } from '../types';

export const neonCyberPaletteLight = [
  '#F72585',
  '#7209B7',
  '#3A0CA3',
  '#4361EE',
  '#4CC9F0',
  '#06038D',
];
export const neonCyberPaletteDark = [
  '#FF4D9F',
  '#9D4EDD',
  '#5A189A',
  '#5E81F4',
  '#72DEF5',
  '#3A56F5',
];

export const neonCyberPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? neonCyberPaletteDark : neonCyberPaletteLight;
