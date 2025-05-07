import { CurveFactory } from '@mui/x-charts-vendor/d3-shape';
import { FunnelCurveType } from './curve.types';
import { Step } from './step';
import { Linear } from './linear';
import { Bump } from './bump';

const curveConstructor = (curve: FunnelCurveType | undefined) => {
  if (curve === 'step') {
    return Step;
  }
  if (curve === 'bump') {
    return Bump;
  }
  return Linear;
};

export const getFunnelCurve = (
  curve: FunnelCurveType | undefined,
  isHorizontal: boolean,
  gap: number | undefined,
  dataIndex: number,
  totalDataPoints: number,
  borderRadius: number | undefined,
): CurveFactory => {
  return (context) =>
    new (curveConstructor(curve))(context as any, {
      isHorizontal,
      gap,
      position: dataIndex,
      sections: totalDataPoints,
      borderRadius,
    });
};
