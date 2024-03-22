import { scaleOrdinal, scaleThreshold, scaleSequential, ScaleOrdinal } from 'd3-scale';
import {
  ContinuouseColorConfig,
  PiecewiseColorConfig,
  OrdinalColorConfig,
} from '../models/colorMapping';

export function getSequentialColorScale<V extends number | Date>(
  config: ContinuouseColorConfig<V> | PiecewiseColorConfig<V>,
) {
  if (config.type === 'piecewise') {
    const sortedSlices = config.slices.sort((sliceA, sliceB) => {
      const minA = sliceA.sm ?? sliceA.sme;
      if (minA === undefined) {
        return 1;
      }
      const minB = sliceB.sm ?? sliceB.sme;
      if (minB === undefined) {
        return -1;
      }

      return minA < minB ? 1 : -1;
    });

    const thresholds: (number | Date)[] = [];
    const colors: (string | null)[] = [];

    sortedSlices.forEach((slice) => {
      const min = slice.sm ?? slice.sme;
      const max = slice.lg ?? slice.lge;
      if (min === undefined) {
        if (max) {
          thresholds.push(max);
        }
        colors.push(config.unknownColor ?? null);
        colors.push(slice.color);
        return;
      }
      if (min === thresholds[thresholds.length - 1]) {
        thresholds.push(min);
        if (max) {
          thresholds.push(max);
        }
        colors.push(slice.color);
        return;
      }
      if (min > thresholds[thresholds.length - 1]) {
        thresholds.push(min);
        if (max) {
          thresholds.push(max);
        }
        colors.push(config.unknownColor ?? null);
        colors.push(slice.color);
      }
    });

    return scaleThreshold(thresholds, colors);
  }

  return scaleSequential([config.min ?? 0, config.max ?? 100], config.color);
}

export function getOrdinalColorScale<V extends number | Date | string>(
  config: OrdinalColorConfig<V>,
): ScaleOrdinal<V, string, null | string> | ScaleOrdinal<number, string, null | string> {
  if (config.values) {
    return scaleOrdinal(config.values, config.colors).unknown(config.unknownColor ?? null);
  }
  return scaleOrdinal(
    config.colors.map((_, index) => index),
    config.colors,
  ).unknown(config.unknownColor ?? null);
}

export function getColorScale(
  config: ContinuouseColorConfig | PiecewiseColorConfig | OrdinalColorConfig,
) {
  return config.type === 'ordinal' ? getOrdinalColorScale(config) : getSequentialColorScale(config);
}
