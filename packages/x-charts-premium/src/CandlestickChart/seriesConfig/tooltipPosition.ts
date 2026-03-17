import {
  isBandScale,
  isOrdinalScale,
  type TooltipItemPositionGetter,
} from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'ohlc'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const itemSeries = series.ohlc?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const datum = itemSeries.data[identifier.dataIndex];

  if (!datum) {
    return null;
  }

  const xScale = axesConfig.x.scale;
  const yScale = axesConfig.y.scale;

  if (!isBandScale(xScale) || isOrdinalScale(yScale)) {
    return null;
  }

  const [, high, low] = datum;

  const x = xScale(xScale.domain()[identifier.dataIndex])!;
  const width = xScale.bandwidth();
  const y = yScale(high);
  const height = yScale(low) - yScale(high);

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
