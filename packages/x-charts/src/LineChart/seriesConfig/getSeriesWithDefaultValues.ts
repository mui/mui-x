import { defaultizeColorPerSeries } from '../../internals/defaultizeColorPerSeries';
import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'line'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...defaultizeColorPerSeries<'line'>(seriesData, seriesIndex, colors),
  };
};

export default getSeriesWithDefaultValues;
