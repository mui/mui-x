import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'radialLine'> = (
  seriesData,
  seriesIndex,
  colors,
) => ({
  ...seriesData,
  id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
  color: seriesData.color ?? colors[seriesIndex % colors.length],
  curve: seriesData.curve ?? 'natural',
});

export default getSeriesWithDefaultValues;
