import { type TooltipItemPositionGetter } from '@mui/x-charts/internals';
import { getRangeBarDimensions } from '../useRangeBarPlotData';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'rangeBar'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.rangeBar?.series[identifier.seriesId];

  if (series.rangeBar == null || itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const dimensions = getRangeBarDimensions(
    itemSeries.layout,
    axesConfig.x,
    axesConfig.y,
    itemSeries.data,
    identifier.dataIndex,
    series.rangeBar.seriesOrder.length,
    series.rangeBar.seriesOrder.findIndex((id) => id === itemSeries.id),
  );

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
