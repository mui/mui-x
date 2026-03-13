import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { type BarInterpolatedProps } from './useAnimateBar';
import { type BarLabelInterpolatedProps } from './useAnimateBarLabel';
import { type GaugeValueArcInterpolatedProps } from './useAnimateGaugeValueArc';
import { type PieArcInterpolatedProps } from './useAnimatePieArc';
import { type PieArcLabelInterpolatedProps } from './useAnimatePieArcLabel';

export function createInterpolator<
  T extends
    | BarInterpolatedProps
    | BarLabelInterpolatedProps
    | GaugeValueArcInterpolatedProps
    | PieArcInterpolatedProps
    | PieArcLabelInterpolatedProps,
>(from: T, to: T): (t: number) => T {
  const interpolators: Partial<Record<keyof T, (t: number) => any>> = {};
  (Object.keys(to) as (keyof T)[]).forEach((key) => {
    interpolators[key] = interpolateNumber(from[key] as number, to[key] as number);
  });

  return (t: number) => {
    const result: Partial<T> = {};
    (Object.keys(interpolators) as (keyof T)[]).forEach((key) => {
      result[key] = interpolators[key]!(t);
    });
    return result as T;
  };
}
