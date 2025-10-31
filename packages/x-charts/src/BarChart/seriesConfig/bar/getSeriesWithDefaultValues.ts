import { AllSeriesType } from '../../../models/seriesType';

export function getSeriesWithDefaultValues<T extends 'bar' | 'barRange'>(
  seriesData: AllSeriesType<T>,
  seriesIndex: number,
  colors: readonly string[],
) {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
  };
}
