import type { GetSeriesWithDefaultValues } from '../../plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'line'> = (
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
