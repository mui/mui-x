import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'pie'> = new Set(['pie']);

const allowCycles = false;
// Pie arcs are per-series items: cap navigation at the focused series length.
const useCurrentSeriesMaxLength = true;

const keyboardFocusHandler: KeyboardFocusHandler<'pie', 'pie'> = createCommonKeyboardFocusHandler(
  outSeriesTypes,
  allowCycles,
  useCurrentSeriesMaxLength,
);

export default keyboardFocusHandler;
