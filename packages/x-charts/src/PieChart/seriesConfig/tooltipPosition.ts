import { findMinMax } from '../../internals/findMinMax';
import { getPercentageValue } from '../../internals/getPercentageValue';
import type { TooltipItemPositionGetter } from '../../internals/plugins/models/seriesConfig/tooltipItemPositionGetter.types';
import { getPieCoordinates } from '../getPieCoordinates';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'pie'> = (params) => {
  const { series, drawingArea, identifier, placement } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const itemSeries = series.pie?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  const { cx, cy, availableRadius } = getPieCoordinates(
    { cx: itemSeries.cx, cy: itemSeries.cy },
    drawingArea,
  );

  const { data, innerRadius: baseInnerRadius = 0, outerRadius: baseOuterRadius } = itemSeries;

  const innerRadius = Math.max(0, getPercentageValue(baseInnerRadius ?? 0, availableRadius));

  const outerRadius = Math.max(
    0,
    getPercentageValue(baseOuterRadius ?? availableRadius, availableRadius),
  );

  const dataItem = data[identifier.dataIndex];
  if (!dataItem) {
    return null;
  }

  // Compute the 4 corner points of the arc to get the bounding box.
  const points = [
    [innerRadius, dataItem.startAngle],
    [innerRadius, dataItem.endAngle],
    [outerRadius, dataItem.startAngle],
    [outerRadius, dataItem.endAngle],
  ].map(([radius, angle]) => ({
    x: cx + radius * Math.sin(angle),
    y: cy - radius * Math.cos(angle),
  }));

  const [x0, x1] = findMinMax(points.map((p) => p.x));
  const [y0, y1] = findMinMax(points.map((p) => p.y));

  switch (placement) {
    case 'bottom':
      return { x: (x1 + x0) / 2, y: y1 };
    case 'left':
      return { x: x0, y: (y1 + y0) / 2 };
    case 'right':
      return { x: x1, y: (y1 + y0) / 2 };
    case 'top':
    default:
      return { x: (x1 + x0) / 2, y: y0 };
  }
};

export default tooltipItemPositionGetter;
