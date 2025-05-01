import { CurveFactory } from '@mui/x-charts-vendor/d3-shape';
import { FunnelCurveType } from './curve.types';
import { FunnelStep } from './funnelStep';
import { Linear } from './linear';
import { Bump } from './bump';

const curveConstructor = (curve: FunnelCurveType | undefined) => {
  if (curve === 'step') {
    return FunnelStep;
  }
  if (curve === 'bump') {
    return Bump;
  }
  return Linear;
};

export const getFunnelCurve = (
  curve: FunnelCurveType | undefined,
  isHorizontal: boolean,
  gap: number = 0,
): CurveFactory => {
  return (context) => new (curveConstructor(curve))(context as any, isHorizontal, gap);
};
