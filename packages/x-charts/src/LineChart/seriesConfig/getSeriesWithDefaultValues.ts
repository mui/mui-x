import type { GetSeriesWithDefaultValues } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import type { MarkShape } from '../../models/seriesType/line';

const defaultShapes: MarkShape[] = [
  'circle',
  'square',
  'diamond',
  'cross',
  'star',
  'triangle',
  'wye',
];

const getSeriesWithDefaultValues: GetSeriesWithDefaultValues<'line'> = (
  seriesData,
  seriesIndex,
  colors,
) => {
  return {
    ...seriesData,
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: seriesData.color ?? colors[seriesIndex % colors.length],
    shape: seriesData.shape ?? defaultShapes[seriesIndex % defaultShapes.length],
  };
};

export default getSeriesWithDefaultValues;
