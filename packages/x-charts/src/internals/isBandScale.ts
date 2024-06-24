import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { D3Scale } from '../models/axis';

export function isBandScale<T extends { toString(): string }>(
  scale: D3Scale<T>,
): scale is ScaleBand<T> | ScalePoint<T> {
  return (scale as ScaleBand<T> | ScalePoint<T>).bandwidth !== undefined;
}
