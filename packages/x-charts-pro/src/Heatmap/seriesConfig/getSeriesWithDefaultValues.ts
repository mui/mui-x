import { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'heatmap'> = (
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
