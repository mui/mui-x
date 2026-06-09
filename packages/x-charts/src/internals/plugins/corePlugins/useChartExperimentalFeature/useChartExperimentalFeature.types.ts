import { type ChartPluginSignature } from '../../models';
import type {
  CartesianChartSeriesType,
  ChartSeriesType,
} from '../../../../models/seriesType/config';

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

interface CartesianExperimentalFeatures {
  /**
   * Automatically reduces the number of ticks and tick labels on ordinal axes
   * (`band` / `point` scales) based on the rendered drawing area size.
   *
   * Explicit `tickNumber`, `tickSpacing`, or `tickInterval` values set by the
   * consumer are not overridden.
   */
  useNewDefaultTickSpacing?: boolean;
}

/* True if any cartesian series (which can have `band` / `point` scales) is in `SeriesType`. */
type HasCartesianSeries<SeriesType extends ChartSeriesType> = [
  Extract<SeriesType, CartesianChartSeriesType>,
] extends [never]
  ? false
  : true;

export type ChartExperimentalFeatures<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ('line' extends SeriesType ? LineExperimentalFeatures : {}) &
    (HasCartesianSeries<SeriesType> extends true ? CartesianExperimentalFeatures : {});

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
