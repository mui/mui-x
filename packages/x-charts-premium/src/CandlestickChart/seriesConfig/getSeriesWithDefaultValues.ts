import { type AllSeriesType } from '@mui/x-charts/models';
import { defaultUpColor, defaultDownColor } from '../../colorPalettes/complementary/candlestick';

export function getSeriesWithDefaultValues(
  seriesData: AllSeriesType<'ohlc'>,
  seriesIndex: number,
  colors: readonly string[],
  theme: 'light' | 'dark',
) {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
    upColor:
      typeof seriesData.upColor === 'function'
        ? seriesData.upColor(theme)
        : (seriesData.upColor ?? defaultUpColor(theme)),
    downColor:
      typeof seriesData.downColor === 'function'
        ? seriesData.downColor(theme)
        : (seriesData.downColor ?? defaultDownColor(theme)),
  };
}
