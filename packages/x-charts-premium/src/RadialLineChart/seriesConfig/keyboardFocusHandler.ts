import { createCommonKeyboardFocusHandler } from '../../../../x-charts/src/internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../../../x-charts/src/internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import {
  type ComposableRadialChartSeriesType,
  composableRadialSeriesTypes,
} from '../../../../x-charts/src/models/seriesType/composition';

const keyboardFocusHandler: KeyboardFocusHandler<'radial-line', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<'radial-line', ComposableRadialChartSeriesType>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
