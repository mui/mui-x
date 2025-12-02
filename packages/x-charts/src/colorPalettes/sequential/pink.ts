// Pink sequential gradient palette based on the color scheme
import { ChartsColorPaletteCallback } from '../types';

export const pinkPaletteLight = [
  '#F7D2E1',
  '#F6BED5',
  '#F4A0C3',
  '#F6619F',
  '#EE448B',
  '#E32977',
  '#B6215F',
  '#8B1F4C',
];
export const pinkPaletteDark = pinkPaletteLight;

export const pinkPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? pinkPaletteDark : pinkPaletteLight;
