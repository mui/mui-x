import { type ColorProcessor } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';
import { resolveColorProcessor } from '../../../internals/resolveColorProcessor';

const getColor: ColorProcessor<'bar'> = (series, xAxis, yAxis) => {
  const verticalLayout = series.layout === 'vertical';
  return resolveColorProcessor({
    series,
    valueColorScale: verticalLayout ? yAxis?.colorScale : xAxis?.colorScale,
    categoryColorScale: verticalLayout ? xAxis?.colorScale : yAxis?.colorScale,
    categoryValues: verticalLayout ? xAxis?.data : yAxis?.data,
  });
};

export default getColor;
