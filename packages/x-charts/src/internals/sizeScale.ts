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

export function getOrdinalSizeScale(
  config: OrdinalSizeConfig,
): ScaleOrdinal<number | Date | string, number, number | null> {
  if (config.values) {
    return scaleOrdinal<number | Date | string, number>(config.values, config.sizes).unknown(
      config.unknownSize ?? null,
    );
  }
  return scaleOrdinal<number | Date | string, number>(
    config.sizes.map((_, index) => index),
    config.sizes,
  ).unknown(config.unknownSize ?? null);
}

export function getSizeScale(
  config: OrdinalSizeConfig,
): ScaleOrdinal<number | Date | string, number, number | null>;
export function getSizeScale(
  config: ContinuousSizeConfig | PiecewiseSizeConfig,
): ScaleThreshold<number | Date, number | null> | ScaleSequential<number, number | null>;
export function getSizeScale(
  config: ContinuousSizeConfig | PiecewiseSizeConfig | OrdinalSizeConfig,
):
  | ScaleOrdinal<number | Date | string, number, number | null>
  | ScaleThreshold<number | Date, number | null>
  | ScaleSequential<number, number | null> {
  return config.type === 'ordinal' ? getOrdinalSizeScale(config) : getSequentialSizeScale(config);
}
