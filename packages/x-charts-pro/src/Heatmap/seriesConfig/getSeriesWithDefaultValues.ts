import { type GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'heatmap'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    color: colors[seriesIndex % colors.length],
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
  };
};

export default getSeriesWithDefaultValues;
