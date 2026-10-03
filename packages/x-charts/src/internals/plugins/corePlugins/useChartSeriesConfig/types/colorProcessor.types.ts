import type {
  ChartsRadiusAxisProps,
  ChartsRotationAxisProps,
  ComputedAxis,
  ComputedXAxis,
  ComputedYAxis,
  ScaleName,
} from '../../../../../models/axis';
import type { DefaultizedSeriesType } from '../../../../../models/seriesType';
import type { ZAxisDefaultized } from '../../../../../models/z-axis';
import type { ChartSeriesType, ChartsSeriesConfig } from '../../../../../models/seriesType/config';

/**
 * Maps a data index to a color.
 * When `dataIndex` is not defined, it falls back to the series color if there is one.
 * @param {number} [dataIndex] The index of the item to color.
 * @returns {string} The color to use for the item.
 */
export type DefaultColorGetter = (dataIndex?: number) => string;

/**
 * The color getter a series' `colorProcessor` returns.
 * Series needing another signature declare `colorGetter` in their `ChartsSeriesConfig` entry.
 * `SeriesType` stays naked so the conditional distributes over unions.
 */
export type ColorGetter<SeriesType extends ChartSeriesType> = SeriesType extends any
  ? ChartsSeriesConfig[SeriesType] extends { colorGetter: infer SeriesColorGetter }
    ? SeriesColorGetter
    : DefaultColorGetter
  : never;

export type ColorProcessor<SeriesType extends ChartSeriesType> = (
  series: DefaultizedSeriesType<SeriesType>,
  /**
   * Either the x-axis or rotation-axis, depending on the coordinate system.
   */
  mainAxis?: ComputedXAxis | ComputedAxis<ScaleName, any, ChartsRotationAxisProps>,
  /**
   * Either the y-axis or radius-axis, depending on the coordinate system.
   */
  secondaryAxis?: ComputedYAxis | ComputedAxis<ScaleName, any, ChartsRadiusAxisProps>,
  zAxis?: ZAxisDefaultized,
) => ColorGetter<SeriesType>;
