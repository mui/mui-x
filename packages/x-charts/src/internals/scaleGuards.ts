import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { D3OrdinalScale, D3Scale } from '../models/axis';

export function isOrdinalScale<T extends { toString(): string }>(
  scale: D3Scale<T>,
): scale is D3OrdinalScale<T> {
  return (scale as ScaleBand<T> | ScalePoint<T>).bandwidth !== undefined;
}

export function isBandScale<T extends { toString(): string }>(
  scale: D3Scale<T>,
): scale is ScaleBand<T> {
  return isOrdinalScale(scale) && (scale as ScaleBand<T>).paddingOuter !== undefined;
}

export function isPointScale<T extends { toString(): string }>(
  scale: D3Scale<T>,
): scale is D3OrdinalScale<T> {
  return isOrdinalScale(scale) && !('paddingOuter' in scale);
}
