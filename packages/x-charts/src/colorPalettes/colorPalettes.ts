export type ChartsColorPaletteCallback = (mode: 'light' | 'dark') => string[];
export type ChartsColorPalette = string[] | ChartsColorPaletteCallback;

export const blueberryTwilightPaletteLight = [
  '#4041E9',
  '#2E96FF',
  '#E778F9',
  '#F5CB8C',
  '#27B9C2',
  '#2ACCFF',
  '#F16EBC',
  '#8789F9',
  '#8538E7',
  '#6F10BA',
];

export const blueberryTwilightPaletteDark = blueberryTwilightPaletteLight;

export const blueberryTwilightPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? blueberryTwilightPaletteLight : blueberryTwilightPaletteLight;

export const bananaMilkshakePaletteLight = [
  '#E2C796',
  '#FE3C50',
  '#8A8F52',
  '#F97784',
  '#FFC13B',
  '#C34164',
  '#ADC972',
  '#FE9C41',
  '#9E7754',
  '#D77D46',
];
export const bananaMilkshakePaletteDark = [
  '#FFEA9F',
  '#E8152A',
  '#575D1D',
  '#FF5566',
  '#FFC13B',
  '#921537',
  '#A3C972',
  '#FF8411',
  '#9E7754',
  '#973900',
];
export const bananaMilkshakePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? bananaMilkshakePaletteDark : bananaMilkshakePaletteLight;

export const rainbowSurgePaletteLight = [
  '#2E96FF',
  '#54C690',
  '#FFB219',
  '#F73B4B',
  '#FF7A19',
  '#F287B3',
  '#8914FE',
];

export const rainbowSurgePaletteDark = rainbowSurgePaletteLight;

export const rainbowSurgePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? rainbowSurgePaletteDark : rainbowSurgePaletteLight;

export const crocodileTailPaletteLight = [
  '#0064D6',
  '#0FD0FB',
  '#e1d300',
  '#098087',
  '#54C690',
  '#077240',
  '#004056',
];

export const crocodileTailPaletteDark = [
  '#0064D6',
  '#0FD0FB',
  '#e1d300',
  '#098087',
  '#54C690',
  '#077240',
  '#b3b4b4',
];

export const crocodileTailPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? crocodileTailPaletteDark : crocodileTailPaletteLight;

export const flamingoParadePaletteLight = [
  '#F25C5C',
  '#FAC14F',
  '#DE264C',
  '#FF8EA9',
  '#FD0076',
  '#C3A0A6',
  '#FF7F0F',
];

export const flamingoParadePaletteDark = flamingoParadePaletteLight;

export const flamingoParadePalettePalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? flamingoParadePaletteDark : flamingoParadePaletteLight;

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
