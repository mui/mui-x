import { TooltipItemPositionGetter } from '@mui/x-charts/internals';
import { createPositionGetter } from '../coordinateMapper';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'funnel'> = (params) => {
  const { series, identifier, axesConfig, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.funnel?.series[identifier.seriesId];

  if (series.funnel == null || itemSeries == null) {
    return null;
  }

  if (axesConfig.x === undefined || axesConfig.y === undefined) {
    return null;
  }

  const isHorizontal = itemSeries.layout === 'horizontal';
  const baseScaleConfig = isHorizontal ? axesConfig.x : axesConfig.y;

  // FIXME gap should be obtained from the store.
  // Maybe moving it to the series would be a good idea similar to what we do with bar charts and their stackingGroups
  const gap = 0;

  const xPosition = createPositionGetter(axesConfig.x.scale, isHorizontal, gap);
  const yPosition = createPositionGetter(axesConfig.y.scale, !isHorizontal, gap);

  const allY = itemSeries.dataPoints[identifier.dataIndex].map((v) =>
    yPosition(
      v.y,
      identifier.dataIndex,
      baseScaleConfig.data?.[identifier.dataIndex],
      v.stackOffset,
      v.useBandWidth,
    ),
  );
  const allX = itemSeries.dataPoints[identifier.dataIndex].map((v) =>
    xPosition(
      v.x,
      identifier.dataIndex,
      baseScaleConfig.data?.[identifier.dataIndex],
      v.stackOffset,
      v.useBandWidth,
    ),
  );

  const x0 = Math.min(...allX);
  const x1 = Math.max(...allX);
  const y0 = Math.min(...allY);
  const y1 = Math.max(...allY);

  switch (placement) {
    case 'top':
      return { x: (x1 + x0) / 2, y: y0 };
    case 'bottom':
      return { x: (x1 + x0) / 2, y: y1 };
    case 'left':
      return { x: x0, y: (y1 + y0) / 2 };
    case 'right':
      return { x: x1, y: (y1 + y0) / 2 };
    default:
      return { x: (x1 + x0) / 2, y: (y1 + y0) / 2 };
  }
};

export default tooltipItemPositionGetter;
