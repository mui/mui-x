import { defaultizeColorPerSeries, GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'heatmap'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...defaultizeColorPerSeries<'heatmap'>(seriesData, seriesIndex, colors),
  };
};

export default getSeriesWithDefaultValues;
