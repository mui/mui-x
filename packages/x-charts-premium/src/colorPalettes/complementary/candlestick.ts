import { type ChartsColorPaletteCallback } from '@mui/x-charts/colorPalettes';

export const candlestickPaletteLight = ['#2e7d32', '#d32f2f'];
export const candlestickPaletteDark = ['#66bb6a', '#f44336'];

export const candlestickPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? candlestickPaletteDark : candlestickPaletteLight;
