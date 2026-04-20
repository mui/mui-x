import { type D3OrdinalScale } from '../../models/axis';
import { generatePolar2svg } from '../../internals/plugins/featurePlugins/useChartPolarAxis/coordinateTransformation';
import { getDrawingAreaCenter } from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import type { TooltipItemPositionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipItemPositionGetter: TooltipItemPositionGetter<'radar'> = (params) => {
  const { series, identifier, axesConfig, drawingArea, placement } = params;

  if (!identifier) {
    return null;
  }
  const itemSeries = series.radar?.series[identifier.seriesId];

  if (itemSeries == null) {
    return null;
  }

  const { radiusAxes, rotationAxes } = axesConfig;

  if (radiusAxes === undefined || rotationAxes === undefined) {
    return null;
  }

  // Only one rotation axis is supported for radar charts
  const rotationAxis = rotationAxes.axis[rotationAxes.axisIds[0]];

  const metrics = (rotationAxis.scale.domain() as (string | number)[]) ?? [];
  const angles = metrics.map((key) => (rotationAxis.scale as D3OrdinalScale)(key)!);

  const { cx, cy } = getDrawingAreaCenter(drawingArea);
  const polar2svg = generatePolar2svg({ cx, cy });

  const points = itemSeries.data.map((value, dataIndex) => {
    const rId = radiusAxes.axisIds[dataIndex];
    const r = radiusAxes.axis[rId].scale(value)!;

    const angle = angles[dataIndex];
    return polar2svg(r, angle);
  });

  if (points.length === 0) {
    return null;
  }

  if (identifier.dataIndex != null) {
    const point = points[identifier.dataIndex];
    switch (placement) {
      case 'right':
        return { x: point[0] + 4, y: point[1] };
      case 'bottom':
        return { x: point[0], y: point[1] + 4 };
      case 'left':
        return { x: point[0] - 4, y: point[1] };
      case 'top':
      default:
        return { x: point[0], y: point[1] - 4 };
    }
  }
  const [top, right, bottom, left] = points.reduce(
    (acc, [x, y]) => {
      return [Math.min(y, acc[0]), Math.max(x, acc[1]), Math.max(y, acc[2]), Math.min(x, acc[3])];
    },
    [Infinity, -Infinity, -Infinity, Infinity],
  );

  switch (placement) {
    case 'right':
      return { x: right, y: (top + bottom) / 2 };
    case 'bottom':
      return { x: (left + right) / 2, y: bottom };
    case 'left':
      return { x: left, y: (top + bottom) / 2 };
    case 'top':
    default:
      return { x: (left + right) / 2, y: top };
  }
};

export default tooltipItemPositionGetter;
