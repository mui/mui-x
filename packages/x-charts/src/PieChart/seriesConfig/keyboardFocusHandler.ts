import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

const keyboardFocusHandler: KeyboardFocusHandler<'pie', 'pie'> =
  createCommonKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;
