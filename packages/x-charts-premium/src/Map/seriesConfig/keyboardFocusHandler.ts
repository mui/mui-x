import {
  createCommonKeyboardFocusHandler,
  type KeyboardFocusHandler,
} from '@mui/x-charts/internals';

const mapShapeSeriesTypes = new Set(['mapShape'] as const);

/**
 * Move the focus across the shapes of the map series.
 *
 * `ArrowRight`/`ArrowLeft` move to the next/previous shape of the focused series,
 * while `ArrowUp`/`ArrowDown` move between series.
 */
const keyboardFocusHandler: KeyboardFocusHandler<'mapShape', 'mapShape'> =
  createCommonKeyboardFocusHandler(mapShapeSeriesTypes);

export default keyboardFocusHandler;
