import {
  type KeyboardFocusHandler,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';

const outSeriesTypes: Set<'funnel'> = new Set(['funnel']);

const keyboardFocusHandler: KeyboardFocusHandler<'funnel', 'funnel'> =
  createCommonKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;
