import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'pie'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...seriesData,
    data: seriesData.data.map((d, index) => ({
      color: colors[index % colors.length],
      ...d,
    })),
  };
};

export default getSeriesWithDefaultValues;
