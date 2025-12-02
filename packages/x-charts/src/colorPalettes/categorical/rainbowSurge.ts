import { ChartsColorPaletteCallback } from '../types';

export const rainbowSurgePaletteLight = [
  '#4254FB',
  '#FFB422',
  '#FA4F58',
  '#0DBEFF',
  '#22BF75',
  '#FA83B4',
  '#FF7511',
];

export const rainbowSurgePaletteDark = [
  '#495AFB',
  '#FFC758',
  '#F35865',
  '#30C8FF',
  '#44CE8D',
  '#F286B3',
  '#FF8C39',
];

export const rainbowSurgePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? rainbowSurgePaletteDark : rainbowSurgePaletteLight;
