import { type ChartsColorPaletteCallback } from '../types';

export const tropicalPunchPaletteLight = [
  '#06A77D',
  '#7CA443',
  '#F1A208',
  '#E3B441',
  '#D5C67A',
  '#E5A65C',
  '#F5853F',
  '#E55733',
  '#D62828',
  '#6D1B39',
  '#003049',
  '#001E2E',
];
export const tropicalPunchPaletteDark = [
  '#3DD9A9',
  '#9ECE6E',
  '#FFC233',
  '#F3CF66',
  '#E8DC9A',
  '#F0C280',
  '#FFA866',
  '#F87E5C',
  '#F25555',
  '#7E3566',
  '#0A5478',
  '#063C58',
];

export const tropicalPunchPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? tropicalPunchPaletteDark : tropicalPunchPaletteLight;
