import type { ColorProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { resolveColorProcessor } from '../../internals/resolveColorProcessor';

const getColor: ColorProcessor<'line'> = (series, xAxis, yAxis) =>
  resolveColorProcessor({
    series,
    valueColorScale: yAxis?.colorScale,
    categoryColorScale: xAxis?.colorScale,
    categoryValues: xAxis?.data,
  });

export default getColor;
