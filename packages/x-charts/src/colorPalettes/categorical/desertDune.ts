import { type ChartsColorPaletteCallback } from '../types';

export const desertDunePaletteLight = [
  '#E76F51',
  '#EE8859',
  '#F4A261',
  '#EFB365',
  '#E9C46A',
  '#89B17D',
  '#2A9D8F',
  '#287271',
  '#264653',
  '#203A45',
  '#1A2D36',
  '#101D24',
];
export const desertDunePaletteDark = [
  '#F4886B',
  '#F69E74',
  '#F7B57E',
  '#F4C383',
  '#F0D188',
  '#A0C79B',
  '#4FBDAE',
  '#469495',
  '#3D6B7C',
  '#355A6B',
  '#2A4A5A',
  '#1F3744',
];

export const desertDunePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? desertDunePaletteDark : desertDunePaletteLight;
