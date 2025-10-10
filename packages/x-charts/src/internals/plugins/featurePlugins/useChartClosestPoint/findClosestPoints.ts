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
  const fxSq = fx * fx;
  const fySq = fy * fy;
  function sqDistFn(dx: number, dy: number) {
    return fxSq * dx * dx + fySq * dy * dy;
  }

  const isXIncreasing = xScale.range()[1] > xScale.range()[0];
  const isYIncreasing = yScale.range()[1] > yScale.range()[0];
  const xRatio = (svgPointX - drawingArea.left) / drawingArea.width;
  const yRatio = (svgPointY - drawingArea.top) / drawingArea.height;
  const pointX = xZoomStart + (isXIncreasing ? xRatio : 1 - xRatio) * (xZoomEnd - xZoomStart);
  const pointY = yZoomStart + (isYIncreasing ? yRatio : 1 - yRatio) * (yZoomEnd - yZoomStart);

  return flatbush.neighbors(
    pointX,
    pointY,
    maxResults,
    maxRadius != null ? maxRadius * maxRadius : Infinity,
    excludeIfOutsideDrawingArea,
    sqDistFn,
  );
}
