import type { ColorProcessor } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';
import { resolveColorProcessor } from '../../../internals/resolveColorProcessor';
import { getAxisData } from '../../../internals/indexDuplicatedAxisData';

const getColor: ColorProcessor<'bar'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';
  return resolveColorProcessor({
    series,
    valueColorScale: verticalLayout ? yAxis?.colorScale : xAxis?.colorScale,
    categoryColorScale: verticalLayout ? xAxis?.colorScale : yAxis?.colorScale,
    categoryValues: getAxisData(verticalLayout ? xAxis : yAxis),
  });
};

export default getColor;
