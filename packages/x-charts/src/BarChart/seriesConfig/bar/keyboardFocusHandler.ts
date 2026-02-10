import createKeyboardFocusHandler from '../../../internals/createKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'bar' | 'line' | 'scatter'> = new Set(['bar', 'line', 'scatter']);

const keyboardFocusHandler: KeyboardFocusHandler<'bar', 'bar' | 'line' | 'scatter'> =
  createKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;
