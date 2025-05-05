import { CurveFactory } from '@mui/x-charts-vendor/d3-shape';
import { CurveOptions, FunnelCurveType } from './curve.types';
import { Step } from './step';
import { Linear } from './linear';
import { Bump } from './bump';
import { Pyramid } from './pyramid';
import { StepPyramid } from './step-pyramid';

const curveConstructor = (curve: FunnelCurveType | undefined) => {
  if (curve === 'step') {
    return Step;
  }
  if (curve === 'bump') {
    return Bump;
  }
  if (curve === 'pyramid') {
    return Pyramid;
  }
  if (curve === 'step-pyramid') {
    return StepPyramid;
  }
  return Linear;
};

export const getFunnelCurve = (
  curve: FunnelCurveType | undefined,
  options: CurveOptions,
): CurveFactory => {
  return (context) => new (curveConstructor(curve))(context as any, options);
};
