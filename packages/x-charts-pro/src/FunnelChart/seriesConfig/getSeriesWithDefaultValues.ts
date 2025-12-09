import { type GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'funnel'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    borderRadius: seriesData.borderRadius ?? 8,
    data: seriesData.data.map((d, index) => ({
      ...d,
      color: d.color ?? colors[index % colors.length],
    })),
  };
};

export default getSeriesWithDefaultValues;
