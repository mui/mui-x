// Cyan sequential gradient palette based on the color scheme
import { ChartsColorPaletteCallback } from '../types';

export const cyanPaletteLight = [
  '#CFE9E8',
  '#A3DAD8',
  '#7ED0CE',
  '#44BDBA',
  '#299896',
  '#137370',
  '#0E5A58',
  '#073938',
];
export const cyanPaletteDark = cyanPaletteLight;

export const cyanPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? cyanPaletteDark : cyanPaletteLight;
