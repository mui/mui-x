import { type ChartsColorPaletteCallback } from '@mui/x-charts/colorPalettes';

// Uses the default MUI success/error palette values for bullish/bearish candles.
export const candlestickPaletteLight = ['#2e7d32', '#d32f2f'];
export const candlestickPaletteDark = ['#66bb6a', '#f44336'];

export const candlestickPalette: ChartsColorPaletteCallback = (mode) =>
  mode === 'dark' ? candlestickPaletteDark : candlestickPaletteLight;
