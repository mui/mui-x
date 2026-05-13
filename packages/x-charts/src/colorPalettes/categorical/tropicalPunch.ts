import { type ChartsColorPaletteCallback } from '../types';

export const tropicalPunchPaletteLight = [
  '#06A77D',
  '#F1A208',
  '#D5C67A',
  '#F5853F',
  '#D62828',
  '#003049',
];
export const tropicalPunchPaletteDark = [
  '#3DD9A9',
  '#FFC233',
  '#E8DC9A',
  '#FFA866',
  '#F25555',
  '#0A5478',
];

export const tropicalPunchPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? tropicalPunchPaletteDark : tropicalPunchPaletteLight;