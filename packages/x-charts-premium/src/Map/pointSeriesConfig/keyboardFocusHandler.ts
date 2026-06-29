import { createCommonKeyboardFocusHandler } from '@mui/x-charts/internals';
import type { KeyboardFocusHandler } from '@mui/x-charts/internals';

const mapPointSeriesTypes = new Set(['mapPoint'] as const);
const allowCycles = false;
const useCurrentSeriesMaxLength = true;

/**
 * Keyboard navigation for the map point series.
 *
 * Points are identified by their `dataIndex`, so the shared handler is used directly.
 * `ArrowRight`/`ArrowLeft` step within the focused series, `ArrowUp`/`ArrowDown` move between series.
 */
const keyboardFocusHandler: KeyboardFocusHandler<'mapPoint', 'mapPoint'> =
  createCommonKeyboardFocusHandler(mapPointSeriesTypes, allowCycles, useCurrentSeriesMaxLength);

export default keyboardFocusHandler;
