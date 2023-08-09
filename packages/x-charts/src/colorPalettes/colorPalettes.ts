export type ChartsColorPaletteCallback = (mode: 'light' | 'dark') => string[];
export type ChartsColorPalette = string[] | ChartsColorPaletteCallback;

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
