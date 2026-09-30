import { createCommonKeyboardFocusHandler } from '../../internals/createCommonKeyboardFocusHandler';
import type { KeyboardFocusHandler } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation/keyboardFocusHandler.types';

const outSeriesTypes: Set<'radar'> = new Set(['radar']);

const allowCycles = true;
const useCurrentSeriesMaxLength = false;

const keyboardFocusHandler: KeyboardFocusHandler<'radar', 'radar'> =
  createCommonKeyboardFocusHandler(outSeriesTypes, allowCycles, useCurrentSeriesMaxLength);

export default keyboardFocusHandler;
