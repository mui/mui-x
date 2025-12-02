import { ChartsColorPaletteCallback } from '../types';

export const mangoFusionPaletteLight = [
  '#173A5E',
  '#00A3A0',
  '#C91B63',
  '#EF5350',
  '#FFA726',
  '#B800D8',
  '#60009B',
  '#2E96FF',
  '#2731C8',
  '#03008D',
];
export const mangoFusionPaletteDark = [
  '#41698F',
  '#19D0CD',
  '#DE196B',
  '#FC5F5C',
  '#FFD771',
  '#DA00FF',
  '#9001CB',
  '#72CCFF',
  '#2E96FF',
  '#3B48E0',
];

export const mangoFusionPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? mangoFusionPaletteDark : mangoFusionPaletteLight;
