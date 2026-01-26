import type { GetSeriesWithDefaultValues } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'scatter'> = (
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
