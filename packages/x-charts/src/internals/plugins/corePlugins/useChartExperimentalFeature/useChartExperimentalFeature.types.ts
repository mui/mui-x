import type { ChartPluginSignature } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';

interface CommonExperimentalFeatures {
  /**
   * Enables activating the focused item with the Enter and Space keys, which calls `onItemClick`
   * with a `KeyboardEvent`.
   *
   * Import `@mui/x-charts/moduleAugmentation/keyboardItemActivation` to widen the `onItemClick`
   * event type accordingly.
   *
   * This behavior will become the default in the next major version.
   */
  enableKeyboardClickEvents?: boolean;
}

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

interface ScatterExperimentalFeatures {
  /**
   * Enables automatic progressive (batched) rendering for scatter series.
   *
   * When enabled and the `renderer` prop is left unset, the chart switches to
   * the `svg-progressive` renderer above an internal point-count threshold,
   * painting points over several animation frames to keep the main thread
   * responsive. When disabled, the unset `renderer` keeps the synchronous
   * `svg-single` renderer. Setting `renderer` explicitly is unaffected.
   *
   * This behavior will become the default in the next major version.
   */
  progressiveRendering?: boolean;
}

export type ChartExperimentalFeatures<SeriesType extends ChartSeriesType = ChartSeriesType> =
  CommonExperimentalFeatures &
    ('line' extends SeriesType ? LineExperimentalFeatures : {}) &
    ('scatter' extends SeriesType ? ScatterExperimentalFeatures : {});

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
