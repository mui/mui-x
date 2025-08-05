import { Flatbush } from '../internals/Flatbush';
import { ZoomData } from '../internals/plugins/featurePlugins/useChartCartesianAxis/zoom.types';
import { D3Scale } from '../models/axis';
import { DefaultizedScatterSeriesType } from '../models/seriesType/scatter';
import { ChartDrawingArea } from './useDrawingArea';

export function findNearestNeighbor(
  seriesData: DefaultizedScatterSeriesType['data'],
  flatbush: Flatbush,
  drawingArea: ChartDrawingArea,
  xScale: D3Scale,
  yScale: D3Scale,
  xAxisZoom: ZoomData | undefined,
  yAxisZoom: ZoomData | undefined,
  svgPointX: number,
  svgPointY: number,
  voronoiMaxRadius: number = Infinity,
) {
  const xZoomStart = (xAxisZoom?.start ?? 0) / 100;
  const xZoomEnd = (xAxisZoom?.end ?? 100) / 100;
  const yZoomStart = (yAxisZoom?.start ?? 0) / 100;
  const yZoomEnd = (yAxisZoom?.end ?? 100) / 100;

  const normalizedXScale = xScale.copy();
  const normalizedYScale = yScale.copy();
  normalizedXScale.range([0, 1]);
  normalizedYScale.range([0, 1]);

  const excludeIfOutsideDrawingArea = function excludeIfOutsideDrawingArea(index: number) {
    const x = normalizedXScale(seriesData[index].x)!;
    const y = normalizedYScale(seriesData[index].y)!;

    return x >= xZoomStart && x <= xZoomEnd && y >= yZoomStart && y <= yZoomEnd;
  };

  // We need to convert the distance from the original range [0, 1] to the current drawing area
  // so the comparison is done on pixels instead of normalized values.
  // fx and fy are the factors to convert the distance from [0, 1] to the current drawing area.
  const fx = xScale.range()[1] - xScale.range()[0];
  const fy = yScale.range()[1] - yScale.range()[0];
  function sqDistFn(dx: number, dy: number) {
    return fx * fx * dx * dx + fy * fy * dy * dy;
  }

  const maxDistSqFn =
    voronoiMaxRadius === undefined
      ? () => Infinity
      : function maxDistSqFn(dx: number, dy: number) {
          if (dx === 0 && dy === 0) {
            return Infinity;
          }

          const vmrx = voronoiMaxRadius * Math.cos(Math.atan(dy / dx));
          const vmry = voronoiMaxRadius * Math.sin(Math.atan(dy / dx));

          return vmrx * vmrx + vmry * vmry;
        };

  const pointX =
    xZoomStart + ((svgPointX - drawingArea.left) / drawingArea.width) * (xZoomEnd - xZoomStart);
  const pointY =
    yZoomStart + (1 - (svgPointY - drawingArea.top) / drawingArea.height) * (yZoomEnd - yZoomStart);
  const closestPointIndex = flatbush.neighbors(
    pointX,
    pointY,
    1,
    maxDistSqFn,
    fx * fx * voronoiMaxRadius * voronoiMaxRadius,
    fy * fy * voronoiMaxRadius * voronoiMaxRadius,
    excludeIfOutsideDrawingArea,
    sqDistFn,
  )[0];

  return closestPointIndex;
}
