import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'radialBar'> = (
  seriesData,
  seriesIndex,
  colors,
) => ({
  layout: 'vertical',
  minBarSize: 0,
  ...seriesData,
  id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
  color: seriesData.color ?? colors[seriesIndex % colors.length],
});

export default getSeriesWithDefaultValues;
