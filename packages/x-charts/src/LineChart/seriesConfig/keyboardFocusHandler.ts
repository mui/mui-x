import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import {
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
} from '../../models/seriesType/composition';

const keyboardFocusHandler: KeyboardFocusHandler<'line', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler(composableCartesianSeriesTypes);

export default keyboardFocusHandler;
