import { isBandScaleConfig, TooltipItemPositionGetter } from '@mui/x-charts/internals';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'heatmap'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.heatmap?.series[identifier.seriesId];

  if (series.heatmap == null || itemSeries == null) {
    return null;
  }

  if (
    axesConfig.x === undefined ||
    axesConfig.y === undefined ||
    !isBandScaleConfig(axesConfig.x) ||
    !isBandScaleConfig(axesConfig.y)
  ) {
    return null;
  }

  const [xIndex, yIndex] = itemSeries.data[identifier.dataIndex];

  const x = axesConfig.x.scale(axesConfig.x.scale.domain()[xIndex]);
  const y = axesConfig.y.scale(axesConfig.y.scale.domain()[yIndex]);

  if (x === undefined || y === undefined) {
    return null;
  }

  const width = axesConfig.x.scale.bandwidth();
  const height = axesConfig.y.scale.bandwidth();

  switch (placement) {
    case 'top':
      return { x: x + width / 2, y };
    case 'bottom':
      return { x: x + width / 2, y: y + height };
    case 'left':
      return { x, y: y + height / 2 };
    case 'right':
      return { x: x + width, y: y + height / 2 };
    default:
      return { x, y };
  }
};

export default tooltipItemPositionGetter;
