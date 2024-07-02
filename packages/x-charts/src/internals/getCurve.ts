import {
  curveCatmullRom,
  curveLinear,
  curveMonotoneX,
  curveMonotoneY,
  curveNatural,
  curveStep,
  curveStepAfter,
  curveStepBefore,
} from '@mui/x-charts-vendor/d3-shape';
import { CurveType } from '../models/seriesType/line';

export default function getCurveFactory(curveType?: CurveType) {
  switch (curveType) {
    case 'catmullRom': {
      return curveCatmullRom.alpha(0.5);
    }
    case 'linear': {
      return curveLinear;
    }
    case 'monotoneX': {
      return curveMonotoneX;
    }
    case 'monotoneY': {
      return curveMonotoneY;
    }
    case 'natural': {
      return curveNatural;
    }
    case 'step': {
      return curveStep;
    }
    case 'stepBefore': {
      return curveStepBefore;
    }
    case 'stepAfter': {
      return curveStepAfter;
    }
    default:
      return curveMonotoneX;
  }
}
