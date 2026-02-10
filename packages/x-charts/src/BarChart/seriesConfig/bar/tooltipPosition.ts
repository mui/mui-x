import { createGetBarDimensions } from '../../../internals/getBarDimensions';
import type { TooltipItemPositionGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'bar'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.bar?.series[identifier.seriesId];

  if (series.bar == null || itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const groupIndex = series.bar.stackingGroups.findIndex((group) =>
    group.ids.includes(itemSeries.id),
  );

  const dimensions = createGetBarDimensions({
    verticalLayout: itemSeries.layout === 'vertical',
    xAxisConfig: axesConfig.x,
    yAxisConfig: axesConfig.y,
    series: itemSeries,
    numberOfGroups: series.bar.stackingGroups.length,
  })(identifier.dataIndex, groupIndex);

  if (dimensions == null) {
    return null;
  }

  const { x, y, width, height } = dimensions;
  switch (placement) {
    case 'right':
      return { x: x + width, y: y + height / 2 };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'top':
    default:
      return { x: x + width / 2, y };
  }
};

export default tooltipItemPositionGetter;
