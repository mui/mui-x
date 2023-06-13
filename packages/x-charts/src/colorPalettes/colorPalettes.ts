export type ChartsColorPalette = string[] | ((mode: 'light' | 'dark') => string[]);

export const blueberryTwilightPaletteLight = [
  '#02B2AF',
  '#03008D',
  '#B800D8',
  '#007FFF',
  '#313DD3',
  '#7C00C5',
];
export const blueberryTwilightPaletteDark = [
  '#18E9DC',
  '#D7FDFC',
  '#7E8AF5',
  '#4052EC',
  '#007FFF',
  '#CB2CE7',
];

export const blueberryTwilightPalette: ChartsColorPalette = (mode) =>
  mode === 'dark' ? blueberryTwilightPaletteDark : blueberryTwilightPaletteLight;

export const mangoFusionPaletteLight = [
  '#173A5E',
  '#02B2AF',
  '#F00780',
  '#03008D',
  '#2E96FF',
  '#313DD3',
  '#B800D8',
  '#F44336',
  '#FF5C00',
];
export const mangoFusionPaletteDark = [
  '#007FFF',
  '#02B2AF',
  '#18E9DC',
  '#4052EC',
  '#7E8AF5',
  '#CB2CE7',
  '#D7FDFC',
  '#EF287B',
  '#EF5350',
];

export const mangoFusionPalette: ChartsColorPalette = (mode) =>
  mode === 'dark' ? mangoFusionPaletteDark : mangoFusionPaletteLight;
