import { type ChartsColorPaletteCallback } from '../types';

export const sageGardenPaletteLight = [
  '#606C38',
  '#283618',
  '#BC6C25',
  '#DDA15E',
  '#8A9A5B',
  '#3D4A1F',
];
export const sageGardenPaletteDark = [
  '#A3B565',
  '#6B8E3D',
  '#E8A04F',
  '#F0BC7E',
  '#B8C77E',
  '#7A8A4A',
];

export const sageGardenPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? sageGardenPaletteDark : sageGardenPaletteLight;