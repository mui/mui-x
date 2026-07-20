import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import { composableCartesianSeriesTypes } from '../../models/seriesType/composition';
import type { ComposableCartesianChartSeriesType } from '../../models/seriesType/composition';

const allowCycles = false;
// Scatter items are per-series points: cap navigation at the focused series length.
const useCurrentSeriesMaxLength = true;

const keyboardFocusHandler: KeyboardFocusHandler<'scatter', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler(
    composableCartesianSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
