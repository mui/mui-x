import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'pie'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    data: seriesData.data.map((d, index) => ({
      ...d,
      color: d.color ?? colors[index % colors.length],
    })),
  };
};

export default getSeriesWithDefaultValues;
