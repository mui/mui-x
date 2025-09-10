import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { D3DiscreteScale, D3Scale } from '../models/axis';

export function isDiscreteScale<T extends { toString(): string }>(
  scale: D3Scale<T>,
): scale is D3DiscreteScale<T> {
  return (scale as ScaleBand<T> | ScalePoint<T>).bandwidth !== undefined;
}
