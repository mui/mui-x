import type { ColorProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { resolveColorProcessor } from '../../internals/resolveColorProcessor';
import { getAxisData } from '../../internals/indexDuplicatedAxisData';

const getColor: ColorProcessor<'line'> = (series, xAxis, yAxis) =>
  resolveColorProcessor({
    series,
    valueColorScale: yAxis?.colorScale,
    categoryColorScale: xAxis?.colorScale,
    categoryValues: getAxisData(xAxis),
  });

export default getColor;
