import {
  type KeyboardFocusHandler,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';

const outSeriesTypes: Set<'funnel'> = new Set(['funnel']);

const keyboardFocusHandler: KeyboardFocusHandler<'funnel', 'funnel'> =
  createCommonKeyboardFocusHandler(outSeriesTypes) as KeyboardFocusHandler<'funnel', 'funnel'>;

export default keyboardFocusHandler;
