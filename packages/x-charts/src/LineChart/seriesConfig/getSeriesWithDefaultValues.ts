import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'line'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
  };
};

export default getSeriesWithDefaultValues;
