import createKeyboardFocusHandler from '../../internals/createKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'radar'> = new Set(['radar']);

const keyboardFocusHandler: KeyboardFocusHandler<'radar', 'radar'> = createKeyboardFocusHandler(
  outSeriesTypes,
  true,
);

export default keyboardFocusHandler;
