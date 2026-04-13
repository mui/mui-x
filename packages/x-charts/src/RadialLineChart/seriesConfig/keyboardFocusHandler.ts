import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import {
  type ComposableRadialChartSeriesType,
  composableRadialSeriesTypes,
} from '../../models/seriesType/composition';

const keyboardFocusHandler: KeyboardFocusHandler<'radial-line', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<'radial-line', ComposableRadialChartSeriesType>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
