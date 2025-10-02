import { ChartDrawingArea } from '../../../../hooks/useDrawingArea';
import { ScatterValueType } from '../../../../models/seriesType/scatter';
import { Flatbush } from '../../../Flatbush';
import { D3Scale } from '../../../../models/axis';

export function findClosestPoints(
  flatbush: Flatbush,
  drawingArea: Pick<ChartDrawingArea, 'top' | 'left' | 'width' | 'height'>,
  seriesData: readonly ScatterValueType[],
  xScale: D3Scale,
  yScale: D3Scale,
  xZoomStart: number,
  xZoomEnd: number,
  yZoomStart: number,
  yZoomEnd: number,
  svgPointX: number,
  svgPointY: number,
  maxRadius: number = Infinity,
  maxResults = 1,
) {
  const originalXScale = xScale.copy();
  const originalYScale = yScale.copy();
  originalXScale.range([0, 1]);
  originalYScale.range([0, 1]);

  const excludeIfOutsideDrawingArea = function excludeIfOutsideDrawingArea(index: number) {
    const x = originalXScale(seriesData[index].x)!;
    const y = originalYScale(seriesData[index].y)!;

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
    maxRadius === Infinity
      ? () => Infinity
      : function maxDistSqFn(dx: number, dy: number) {
          if (dx === 0 && dy === 0) {
            return Infinity;
          }

          const vmrx = maxRadius * Math.cos(Math.atan(dy / dx));
          const vmry = maxRadius * Math.sin(Math.atan(dy / dx));

          return vmrx * vmrx + vmry * vmry;
        };

  const pointX =
    xZoomStart + ((svgPointX - drawingArea.left) / drawingArea.width) * (xZoomEnd - xZoomStart);
  const pointY =
    yZoomStart + (1 - (svgPointY - drawingArea.top) / drawingArea.height) * (yZoomEnd - yZoomStart);

  return flatbush.neighbors(
    pointX,
    pointY,
    maxResults,
    maxDistSqFn,
    maxRadius != null ? fx * fx * maxRadius * maxRadius : Infinity,
    maxRadius != null ? fy * fy * maxRadius * maxRadius : Infinity,
    excludeIfOutsideDrawingArea,
    sqDistFn,
  );
}
