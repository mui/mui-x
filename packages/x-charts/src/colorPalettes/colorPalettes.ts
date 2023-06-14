export type ChartsColorPaletteCallback = (mode: 'light' | 'dark') => string[];
export type ChartsColorPalette = string[] | ChartsColorPaletteCallback;

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

export const blueberryTwilightPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? blueberryTwilightPaletteDark : blueberryTwilightPaletteLight;

export const mangoFusionPaletteLight = [
  '#173A5E',
  '#02B2AF',
  '#F00780',
  '#F44336',
  '#FF5C00',
  '#B800D8',
  '#7C00C5',
  '#2E96FF',
  '#313DD3',
  '#03008D',
];
export const mangoFusionPaletteDark = [
  '#D7FDFC',
  '#18E9DC',
  '#02B2AF',
  '#EF287B',
  '#EF5350',
  '#FFC24D',
  '#CB2CE7',
  '#7E8AF5',
  '#007FFF',
  '#4052EC',
];

export const mangoFusionPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? mangoFusionPaletteDark : mangoFusionPaletteLight;
