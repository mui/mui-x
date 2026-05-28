import { type ChartPluginSignature } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

interface LineExperimentalFeatures {
  /**
   * Enables pointer-based interaction detection for line and area series.
   *
   * When enabled, the chart uses pointer position to determine which series
   * is closest to the cursor, rather than relying on SVG element hover events.
   *
   * This provides finer control over highlighting and clicking the closest
   * line or point, but uses an approximation (linear interpolation between
   * data points) rather than exact SVG geometry.
   */
  enablePositionBasedPointerInteraction?: boolean;
}

interface BarExperimentalFeatures {
  /**
   * Automatically reduces the number of ticks and tick labels on cartesian
   * axes based on the rendered drawing area size.
   *
   * When enabled, ordinal axes (`band` / `point` scales) receive a default
   * `tickSpacing` derived from the chart width/height, so a 12-month band
   * axis on a 300px wide chart no longer renders 12 overlapping ticks.
   *
   * Continuous axes already pick a size-aware default `tickNumber`; this
   * feature does not override explicit `tickNumber`, `tickSpacing`, or
   * `tickInterval` values set by the consumer.
   */
  responsiveTickAdjustment?: boolean;
}

/* True if any bar-like series (`bar` or `rangeBar`) is in `SeriesType`. */
type HasBarLikeSeries<SeriesType extends ChartSeriesType> = 'bar' extends SeriesType
  ? true
  : 'rangeBar' extends SeriesType
    ? true
    : false;

export type ChartExperimentalFeatures<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ('line' extends SeriesType ? LineExperimentalFeatures : {}) &
    (HasBarLikeSeries<SeriesType> extends true ? BarExperimentalFeatures : {});

export interface UseChartExperimentalFeaturesParameters<
  SeriesType extends ChartSeriesType = ChartSeriesType,
> {
  /**
   * Options to enable features planned for the next major.
   */
  experimentalFeatures?: ChartExperimentalFeatures<SeriesType>;
}

export interface UseChartExperimentalFeaturesState {
  experimentalFeatures?: ChartExperimentalFeatures;
}

export type UseChartExperimentalFeaturesSignature<SeriesType extends ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartExperimentalFeaturesParameters<SeriesType>;
    defaultizedParams: UseChartExperimentalFeaturesParameters<SeriesType>;
    state: UseChartExperimentalFeaturesState;
  }>;
