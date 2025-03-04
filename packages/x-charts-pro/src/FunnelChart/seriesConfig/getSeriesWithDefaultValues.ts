import { GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'funnel'> = (
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
