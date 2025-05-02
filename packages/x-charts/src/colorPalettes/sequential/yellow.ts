// Yellow sequential gradient palette based on the color scheme
import { ChartsColorPaletteCallback } from '../types';

export const yellowPaletteLight = [
  '#FBEFD6',
  '#F5DEB0',
  '#F3CD80',
  '#FAC14F',
  '#FFB219',
  '#EF9801',
  '#DA7D0B',
  '#AB6208',
];
export const yellowPaletteDark = yellowPaletteLight;

export const yellowPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? yellowPaletteDark : yellowPaletteLight;
