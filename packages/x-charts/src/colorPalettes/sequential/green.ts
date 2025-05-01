// Green sequential gradient palette based on the color scheme
import { ChartsColorPaletteCallback } from '../types';

export const greenPaletteLight = [
  '#CDEBDD',
  '#B2E2CB',
  '#8FD8B5',
  '#54C690',
  '#31B375',
  '#359F6D',
  '#0F7746',
  '#065731',
];
export const greenPaletteDark = greenPaletteLight;

export const greenPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? greenPaletteDark : greenPaletteLight;
