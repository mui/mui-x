import { type ScatterValueType } from '../../../../models/seriesType/scatter';
import { type Flatbush } from '../../../Flatbush';
import { type D3Scale } from '../../../../models/axis';
import { isOrdinalScale } from '../../../scaleGuards';

export function findClosestPoints(
  flatbush: Flatbush,
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

  const pointX = originalXScale(
    invertScale(xScale, svgPointX, (dataIndex) => seriesData[dataIndex]?.x),
  );
  const pointY = originalYScale(
    invertScale(yScale, svgPointY, (dataIndex) => seriesData[dataIndex]?.y),
  );

  return flatbush.neighbors(
    pointX,
    pointY,
    maxResults,
    maxRadius != null ? maxRadius * maxRadius : Infinity,
    excludeIfOutsideDrawingArea,
    sqDistFn,
  );
}

function invertScale<T>(scale: D3Scale, value: number, getDataPoint: (dataIndex: number) => T) {
  if (isOrdinalScale(scale)) {
    const dataIndex =
      scale.bandwidth() === 0
        ? Math.floor((value - Math.min(...scale.range()) + scale.step() / 2) / scale.step())
        : Math.floor((value - Math.min(...scale.range())) / scale.step());

    return getDataPoint(dataIndex);
  }

  return scale.invert(value);
}
