export type ChartsColorPaletteCallback = (mode: 'light' | 'dark') => string[];
export type ChartsColorPalette = string[] | ChartsColorPaletteCallback;

export const blueberryTwilightPaletteLight = [
  '#6061fc',
  '#2DA2FF',
  '#e778f9',
  '#ebd28c',
  '#84c3ff',
  '#6d5cd4',
  '#E7A3F2',
  '#44BDBA',
  '#aaabf7',
  '#AFAFAF',
  '#179EA7',
  '#414FCF',
];

export const blueberryTwilightPaletteDark = blueberryTwilightPaletteLight;

export const bananaMilkshakePaletteLight = [
  '#577EE3',
  '#F66170',
  '#FFC13B',
  '#44BDBA',
  '#414FCF',
  '#F3CD80',
  '#F287B3',
  '#FE9C41',
  '#F1BF91',
  '#A89787',
];

export const bananaMilkshakePaletteDark = bananaMilkshakePaletteLight;

export const bananaMilkshakePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? bananaMilkshakePaletteDark : bananaMilkshakePaletteLight;

export const rainbowSurgePaletteLight = [
  '#4254FB',
  '#2E96FF',
  '#54C690',
  '#FFB219',
  '#FF7A19',
  '#F73B4B',
  '#F287B3',
];
export const blueberryTwilightPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? rainbowSurgePaletteLight : rainbowSurgePaletteLight;

export const rainbowSurgePaletteDark = rainbowSurgePaletteLight;

export const rainbowSurgePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? rainbowSurgePaletteDark : rainbowSurgePaletteLight;

export const mangoFusionPaletteLight = [
  '#FF7E35',
  '#DB2671',
  '#577EE3',
  '#FFB03C',
  '#9C2A59',
  '#4254FB',
  '#F6619F',
  '#2EC4C2',
  '#F3CD80',
  '#202B93',
];
export const mangoFusionPaletteDark = [
  '#FFD771',
  '#DE196B',
  '#2E96FF',
  '#41698F',
  '#DA00FF',
  '#72CCFF',
  '#9001CB',
  '#19D0CD',
  '#FC5F5C',
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
