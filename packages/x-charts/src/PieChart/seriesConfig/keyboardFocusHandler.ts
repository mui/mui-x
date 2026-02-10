import { createKeyboardFocusHandler } from '../../internals/createKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

const keyboardFocusHandler: KeyboardFocusHandler<'pie', 'pie'> =
  createKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;
