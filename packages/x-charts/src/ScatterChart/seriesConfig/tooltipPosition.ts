import type { TooltipItemPositionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

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

  const xValue = itemSeries.data?.[identifier.dataIndex].x;
  const yValue = itemSeries.data?.[identifier.dataIndex].y;

  if (xValue == null || yValue == null) {
    return null;
  }

  return {
    x: axesConfig.x.scale(xValue)!,
    y: axesConfig.y.scale(yValue)!,
  };
};

export default tooltipItemPositionGetter;
