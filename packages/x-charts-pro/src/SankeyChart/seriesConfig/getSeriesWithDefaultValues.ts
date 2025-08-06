import type { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

export const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'sankey'> = (
  seriesData,
  seriesIndex,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...seriesData,
  };
};
