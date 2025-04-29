import {
  scaleOrdinal,
  scaleThreshold,
  scaleSequential,
  ScaleOrdinal,
} from '@mui/x-charts-vendor/d3-scale';
import {
  ContinuousColorConfig,
  PiecewiseColorConfig,
  OrdinalColorConfig,
} from '../models/colorMapping';

export function getSequentialColorScale<Value extends number | Date>(
  config: ContinuousColorConfig<Value> | PiecewiseColorConfig<Value>,
) {
  if (config.type === 'piecewise') {
    return scaleThreshold(config.thresholds, config.colors);
  }

  return scaleSequential([config.min ?? 0, config.max ?? 100], config.color);
}

export function getOrdinalColorScale<Value extends number | Date | string>(
  config: OrdinalColorConfig<Value>,
): ScaleOrdinal<Value, string, null | string> | ScaleOrdinal<number, string, null | string> {
  if (config.values) {
    return scaleOrdinal(config.values, config.colors).unknown(config.unknownColor ?? null);
  }
  return scaleOrdinal(
    config.colors.map((_, index) => index),
    config.colors,
  ).unknown(config.unknownColor ?? null);
}

export function getColorScale(
  config: ContinuousColorConfig | PiecewiseColorConfig | OrdinalColorConfig,
) {
  return config.type === 'ordinal' ? getOrdinalColorScale(config) : getSequentialColorScale(config);
}
