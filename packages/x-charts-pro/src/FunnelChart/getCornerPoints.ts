import type { Point, PositionGetter } from './curves';
import type { FunnelDataPoints } from './funnel.types';

export const getCornerPoints = (
  dataPoints: FunnelDataPoints[][],
  xPositionGetter: PositionGetter,
  yPositionGetter: PositionGetter,
): [Point, Point] => {
  const minPoint = {
    x: Infinity,
    y: Infinity,
  };
  const maxPoint = {
    x: -Infinity,
    y: -Infinity,
  };

  dataPoints.forEach((section, dataIndex) => {
    section.forEach((v) => {
      const x = xPositionGetter(v.x, dataIndex, v.stackOffset, v.useBandWidth);
      const y = yPositionGetter(v.y, dataIndex, v.stackOffset, v.useBandWidth);

      minPoint.x = Math.min(minPoint.x, x);
      minPoint.y = Math.min(minPoint.y, y);
      maxPoint.x = Math.max(maxPoint.x, x);
      maxPoint.y = Math.max(maxPoint.y, y);
    });
  });

  return [minPoint, maxPoint];
};
