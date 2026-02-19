import { createKeyboardFocusHandler } from '../../internals/createKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import {
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
} from '../../internals/commonNextFocusItem';

const keyboardFocusHandler: KeyboardFocusHandler<'line', ComposableCartesianChartSeriesType> =
  createKeyboardFocusHandler(composableCartesianSeriesTypes);

export default keyboardFocusHandler;
