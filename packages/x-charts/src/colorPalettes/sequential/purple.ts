// Purple sequential gradient palette based on the color scheme
import { ChartsColorPaletteCallback } from '../types';

export const purplePaletteLight = [
  '#CAD4EE',
  '#98ADE5',
  '#577EE3',
  '#4254FB',
  '#2638DF',
  '#222FA6',
  '#111C7F',
  '#091159',
];
export const purplePaletteDark = purplePaletteLight;

export const purplePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? purplePaletteDark : purplePaletteLight;
