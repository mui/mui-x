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

export type ChartExperimentalFeatures<SeriesType extends ChartSeriesType = ChartSeriesType> =
  'line' extends SeriesType ? LineExperimentalFeatures : {};

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
