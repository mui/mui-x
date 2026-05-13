import type { GetSeriesWithDefaultValues } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'line'> = (
  seriesData,
  seriesIndex,
  colors,
) => ({
  ...seriesData,
  id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
  color: seriesData.color ?? colors[seriesIndex % colors.length],
  curve: seriesData.curve ?? 'monotoneX',
});

export default getSeriesWithDefaultValues;
