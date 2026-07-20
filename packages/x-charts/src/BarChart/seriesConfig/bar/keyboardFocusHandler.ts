import { createCommonKeyboardFocusHandler } from '../../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import { composableCartesianSeriesTypes } from '../../../models/seriesType/composition';
import type { ComposableCartesianChartSeriesType } from '../../../models/seriesType/composition';

const allowCycles = false;
const useCurrentSeriesMaxLength = false;

const keyboardFocusHandler: KeyboardFocusHandler<'bar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler(
    composableCartesianSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
