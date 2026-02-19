import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'radar'> = new Set(['radar']);

const keyboardFocusHandler: KeyboardFocusHandler<'radar', 'radar'> =
  createCommonKeyboardFocusHandler(outSeriesTypes, true);

export default keyboardFocusHandler;
