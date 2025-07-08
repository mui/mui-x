import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'radar'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: colors[seriesIndex % colors.length],
    ...seriesData,
  };
};

export default getSeriesWithDefaultValues;
