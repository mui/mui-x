import { defaultizeColorPerSeriesItem } from '../../internals/defaultizeColor';
import type { GetSeriesWithDefaultValues } from '../../internals/plugins/models/seriesConfig';

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'pie'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    ...defaultizeColorPerSeriesItem<'pie'>(seriesData, colors),
  };
};

export default getSeriesWithDefaultValues;
