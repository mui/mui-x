import { createCommonKeyboardFocusHandler } from '../../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import { composableCartesianSeriesTypes } from '../../../models/seriesType/composition';
import type { ComposableCartesianChartSeriesType } from '../../../models/seriesType/composition';

const keyboardFocusHandler: KeyboardFocusHandler<'bar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler(composableCartesianSeriesTypes);

export default keyboardFocusHandler;
