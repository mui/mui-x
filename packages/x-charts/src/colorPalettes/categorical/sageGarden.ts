import { type ChartsColorPaletteCallback } from '../types';

export const sageGardenPaletteLight = [
  '#606C38',
  '#445128',
  '#283618',
  '#72511E',
  '#BC6C25',
  '#CC8742',
  '#DDA15E',
  '#B49E5C',
  '#8A9A5B',
  '#64723D',
  '#3D4A1F',
  '#252E12',
];
export const sageGardenPaletteDark = [
  '#A3B565',
  '#87A251',
  '#6B8E3D',
  '#A99746',
  '#E8A04F',
  '#ECAE66',
  '#F0BC7E',
  '#D4C27E',
  '#B8C77E',
  '#99A964',
  '#7A8A4A',
  '#5C6938',
];

export const sageGardenPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? sageGardenPaletteDark : sageGardenPaletteLight;
