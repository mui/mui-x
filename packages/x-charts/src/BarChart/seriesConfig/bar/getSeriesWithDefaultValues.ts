import { type AllSeriesType } from '../../../models/seriesType';

export function getSeriesWithDefaultValues(
  seriesData: AllSeriesType<'bar'>,
  seriesIndex: number,
  colors: readonly string[],
) {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
  };
}
