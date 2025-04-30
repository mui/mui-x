import { CurveFactory } from '@mui/x-charts-vendor/d3-shape';
import { FunnelCurveType } from './curve.types';
import { FunnelStep } from './funnelStep';
import { Linear } from './linear';
import { Bump } from './bump';

export const getFunnelCurve = (
  curve: FunnelCurveType | undefined,
  isHorizontal: boolean,
  gap: number = 0,
): CurveFactory => {
  const constructorMap = {
    linear: Linear,
    step: FunnelStep,
    bump: Bump,
  };

  return (context) => new constructorMap[curve ?? 'linear'](context as any, isHorizontal, gap);
};
