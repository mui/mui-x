import { defaultizeColorPerSeries } from '../../internals/defaultizeColor';
import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'bar'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...defaultizeColorPerSeries<'bar'>(seriesData, seriesIndex, colors),
  };
};

export default getSeriesWithDefaultValues;
