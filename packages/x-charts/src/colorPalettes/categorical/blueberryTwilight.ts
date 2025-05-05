import { ChartsColorPaletteCallback } from '../types';

export const blueberryTwilightPaletteLight = [
  '#02B2AF',
  '#2E96FF',
  '#B800D8',
  '#60009B',
  '#2731C8',
  '#03008D',
];
export const blueberryTwilightPaletteDark = [
  '#02B2AF',
  '#72CCFF',
  '#DA00FF',
  '#9001CB',
  '#2E96FF',
  '#3B48E0',
];

export const blueberryTwilightPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? blueberryTwilightPaletteDark : blueberryTwilightPaletteLight;
