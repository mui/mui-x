import { defaultizeColorPerSeriesItem, GetSeriesWithDefaultValues } from '@mui/x-charts/internals';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'funnel'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...defaultizeColorPerSeriesItem<'funnel'>(seriesData, colors),
  };
};

export default getSeriesWithDefaultValues;
