import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { type D3OrdinalScale, type D3Scale } from '../models/axis';

export function isOrdinalScale<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
  Output = number,
>(scale: D3Scale<Domain, Range, Output>): scale is D3OrdinalScale<Domain> {
  return (scale as ScaleBand<Domain> | ScalePoint<Domain>).bandwidth !== undefined;
}

export function isBandScale<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
  Output = number,
>(scale: D3Scale<Domain, Range, Output>): scale is ScaleBand<Domain> {
  return isOrdinalScale(scale) && (scale as ScaleBand<Domain>).paddingOuter !== undefined;
}

export function isPointScale<
  Domain extends { toString(): string } = { toString(): string },
  Range = number,
  Output = number,
>(scale: D3Scale<Domain, Range, Output>): scale is D3OrdinalScale<Domain> {
  return isOrdinalScale(scale) && !('paddingOuter' in scale);
}
