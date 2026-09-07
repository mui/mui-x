import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'mapShape'> = (
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
