import {
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
  curveBumpX,
  curveBumpY,
} from '@mui/x-charts-vendor/d3-shape';
import { CurveType } from '../models/curve';

export function getCurveFactory(curveType?: CurveType) {
  switch (curveType) {
    case 'catmullRom':
      return curveCatmullRom.alpha(0.5);
    case 'linear':
      return curveLinear;
    case 'monotoneX':
      return curveMonotoneX;
    case 'monotoneY':
      return curveMonotoneY;
    case 'natural':
      return curveNatural;
    case 'step':
      return curveStep;
    case 'stepBefore':
      return curveStepBefore;
    case 'stepAfter':
      return curveStepAfter;
    case 'bumpY':
      return curveBumpY;
    case 'bumpX':
      return curveBumpX;
    default:
      return curveMonotoneX;
  }
}
