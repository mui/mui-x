import type { TooltipItemPositionGetter } from '../../internals/plugins/models/seriesConfig/tooltipItemPositionGetter.types';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'line'> = (params) => {
  const { series, identifier, axesConfig } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.line?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const xValue = axesConfig.x.data?.[identifier.dataIndex];
  const yValue =
    itemSeries.data[identifier.dataIndex] == null
      ? null
      : itemSeries.visibleStackedData[identifier.dataIndex][1];

  if (xValue == null || yValue == null) {
    return null;
  }

  return {
    x: axesConfig.x.scale(xValue)!,
    y: axesConfig.y.scale(yValue)!,
  };
};

export default tooltipItemPositionGetter;
