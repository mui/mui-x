import { type Theme } from '@mui/material/styles';

export const overviewChartPaletteLight = [
  '#D8E2F3',
  '#B7C8E7',
  '#8DA9D6',
  '#6389C3',
  '#406AA8',
  '#2A4E82',
  '#19345D',
];

export const overviewChartPaletteDark = [
  '#D8E5FF',
  '#B5CAEF',
  '#8EADDB',
  '#678FC4',
  '#4771A8',
  '#315785',
  '#203D63',
];

export const overviewChartPalette = (mode: 'light' | 'dark') =>
  mode === 'dark' ? overviewChartPaletteDark : overviewChartPaletteLight;

export const overviewExpressivePaletteLight = [
  '#5367E6',
  '#2F91D8',
  '#4AAE82',
  '#F2AA35',
  '#E87534',
  '#E24E60',
  '#D66A9A',
];

export const overviewExpressivePaletteDark = [
  '#8792FF',
  '#66BDF5',
  '#77D5AC',
  '#FFD16A',
  '#FFA069',
  '#FF7F8E',
  '#EE9AC2',
];

export const overviewExpressivePalette = (mode: 'light' | 'dark') =>
  mode === 'dark' ? overviewExpressivePaletteDark : overviewExpressivePaletteLight;

export const overviewPokemonPalette = (mode: 'light' | 'dark') =>
  mode === 'dark' ? ['#81D0A2', '#FF9A72', '#78B7EF'] : ['#4FA778', '#D97345', '#4F93D2'];

export const overviewEmissionsRadarPalette = (mode: 'light' | 'dark') =>
  mode === 'dark' ? ['#69D5D2', '#78B7EF', '#8792FF'] : ['#2B9D9A', '#4F93D2', '#5367E6'];

export const overviewHeatmapPaletteLight = [
  '#F5F7FB',
  '#E3EAF6',
  '#C7D5EC',
  '#9EB8DD',
  '#7298CC',
  '#4D78B4',
  '#315B93',
  '#1D3D67',
];

export const overviewHeatmapPaletteDark = [
  '#172437',
  '#20395A',
  '#2B527E',
  '#3D6FA4',
  '#5B8BC3',
  '#82A9DC',
  '#ABC7F0',
  '#D6E4FF',
];

export const overviewHeatmapPalette = (mode: 'light' | 'dark') =>
  mode === 'dark' ? overviewHeatmapPaletteDark : overviewHeatmapPaletteLight;

export const overviewSemanticColors = {
  positive: (mode: 'light' | 'dark') => (mode === 'dark' ? '#63C79A' : '#2F7D62'),
  negative: (mode: 'light' | 'dark') => (mode === 'dark' ? '#F07F8F' : '#B84A5A'),
  accent: (mode: 'light' | 'dark') => (mode === 'dark' ? '#F2C46D' : '#AA6B00'),
};

function hexToRgb(color: string) {
  const hex = color.replace('#', '');

  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`;
}

function mixHexColors(start: string, end: string, amount: number) {
  const from = hexToRgb(start);
  const to = hexToRgb(end);

  return rgbToHex({
    r: from.r + (to.r - from.r) * amount,
    g: from.g + (to.g - from.g) * amount,
    b: from.b + (to.b - from.b) * amount,
  });
}

export const getOverviewHeatmapColor = (mode: 'light' | 'dark', value: number) => {
  const colors = overviewHeatmapPalette(mode);
  const boundedValue = Math.min(1, Math.max(0, value));
  const scaledValue = boundedValue * (colors.length - 1);
  const colorIndex = Math.floor(scaledValue);

  return mixHexColors(
    colors[colorIndex],
    colors[Math.min(colorIndex + 1, colors.length - 1)],
    scaledValue - colorIndex,
  );
};

export const sxColors = (theme: Theme) =>
  overviewChartPalette(theme.palette.mode).reduce<Record<string, string>>((acc, color, index) => {
    acc[`--palette-color-${index}`] = color;
    return acc;
  }, {});

export const sxExpressiveColors = (theme: Theme) =>
  overviewExpressivePalette(theme.palette.mode).reduce<Record<string, string>>(
    (acc, color, index) => {
      acc[`--palette-color-${index}`] = color;
      return acc;
    },
    {},
  );
