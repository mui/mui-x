import type { TooltipItemPositionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';
import { getScatterX, getScatterY } from '../scatterDataAccess';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'scatter'> = (params) => {
  const { series, identifier, axesConfig } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.scatter?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const xValue = itemSeries.data ? getScatterX(itemSeries.data, identifier.dataIndex) : undefined;
  const yValue = itemSeries.data ? getScatterY(itemSeries.data, identifier.dataIndex) : undefined;

  if (xValue == null || yValue == null) {
    return null;
  }

  return {
    x: axesConfig.x.scale(xValue)!,
    y: axesConfig.y.scale(yValue)!,
  };
};

export default tooltipItemPositionGetter;
