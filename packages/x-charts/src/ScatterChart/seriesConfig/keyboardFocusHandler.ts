import { createActivatingKeyboardFocusHandler } from '../../internals/createActivatingKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import { composableCartesianSeriesTypes } from '../../models/seriesType/composition';
import type { ComposableCartesianChartSeriesType } from '../../models/seriesType/composition';

const keyboardFocusHandler: KeyboardFocusHandler<'scatter', ComposableCartesianChartSeriesType> =
  createActivatingKeyboardFocusHandler(composableCartesianSeriesTypes);

export default keyboardFocusHandler;
