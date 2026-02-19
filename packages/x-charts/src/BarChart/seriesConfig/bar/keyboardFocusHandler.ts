import { createKeyboardFocusHandler } from '../../../internals/createKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';
import {
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
} from '../../../internals/commonNextFocusItem';

const outSeriesTypes: Set<'bar' | 'line' | 'scatter'> = new Set(['bar', 'line', 'scatter']);

const keyboardFocusHandler: KeyboardFocusHandler<'bar', ComposableCartesianChartSeriesType> =
  createKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;
