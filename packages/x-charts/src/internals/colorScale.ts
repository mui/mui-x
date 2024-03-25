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
    return scaleThreshold(config.thresholds, config.colors);
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
