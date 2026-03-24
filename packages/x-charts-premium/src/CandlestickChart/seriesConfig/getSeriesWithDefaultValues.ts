import { type AllSeriesType } from '@mui/x-charts/models';

export function getSeriesWithDefaultValues(
  seriesData: AllSeriesType<'ohlc'>,
  seriesIndex: number,
  colors: readonly string[],
) {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
  };
}
