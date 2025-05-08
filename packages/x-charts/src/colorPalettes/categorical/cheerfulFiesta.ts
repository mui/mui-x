import { ChartsColorPaletteCallback } from '../types';

export const cheerfulFiestaPaletteDark = [
  '#0059B2',
  '#2E96FF',
  '#FFC24C',
  '#FF9F0E',
  '#F38200',
  '#2ABFDE',
  '#1F94AD',
  '#BD2C38',
  '#FF3143',
  '#FF8282',
];
export const cheerfulFiestaPaletteLight = [
  '#003A75',
  '#007FFF',
  '#FFC24C',
  '#FF9D09',
  '#CA6C00',
  '#127D94',
  '#1F94AD',
  '#C82634',
  '#FF3143',
  '#FF7E7E',
];

export const cheerfulFiestaPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? cheerfulFiestaPaletteDark : cheerfulFiestaPaletteLight;
