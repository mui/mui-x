import {
  scaleOrdinal,
  scaleThreshold,
  scaleSequential,
  type ScaleOrdinal,
  type ScaleThreshold,
  type ScaleSequential,
} from '@mui/x-charts-vendor/d3-scale';
import {
  type ContinuousSizeConfig,
  type PiecewiseSizeConfig,
  type OrdinalSizeConfig,
} from '../models/sizeMapping';

export function getSequentialSizeScale<Value extends number | Date>(
  config: ContinuousSizeConfig<Value> | PiecewiseSizeConfig<Value>,
) {
  if (config.type === 'piecewise') {
    return scaleThreshold(config.thresholds, config.sizes);
  }

  return scaleSequential([config.min ?? 0, config.max ?? 100], config.size);
}

export function getOrdinalSizeScale<Value extends number | Date | string>(
  config: OrdinalSizeConfig<Value>,
): ScaleOrdinal<Value, number, null | number> | ScaleOrdinal<number, number, null | number> {
  if (config.values) {
    return scaleOrdinal(config.values, config.sizes).unknown(config.unknownSize ?? null);
  }
  return scaleOrdinal(
    config.sizes.map((_, index) => index),
    config.sizes,
  ).unknown(config.unknownSize ?? null);
}

export function getSizeScale<Value extends number | Date = number | Date>(
  config: ContinuousSizeConfig<Value> | PiecewiseSizeConfig<Value>,
): ScaleThreshold<Value, number, never> | ScaleSequential<Value, number | null>;
export function getSizeScale<Value extends number | Date | string>(
  config: OrdinalSizeConfig<Value>,
): ScaleOrdinal<Value, number, null | number> | ScaleOrdinal<number, number, null | number>;
export function getSizeScale<Value extends number | Date | string>(
  config: ContinuousSizeConfig<Exclude<Value, string>> | PiecewiseSizeConfig<Exclude<Value, string>> | OrdinalSizeConfig<Value>,
) {
  return config.type === 'ordinal' ? getOrdinalSizeScale(config) : getSequentialSizeScale(config);
}
