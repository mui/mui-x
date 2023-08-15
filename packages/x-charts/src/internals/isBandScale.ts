import type { ScaleBand, ScalePoint } from 'd3-scale';
import { D3Scale } from '../models/axis';

export function isBandScale(scale: D3Scale): scale is ScaleBand<any> | ScalePoint<any> {
  return (scale as ScaleBand<any> | ScalePoint<any>).bandwidth !== undefined;
}
