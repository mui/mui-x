import { createKeyboardFocusHandler, type KeyboardFocusHandler } from '@mui/x-charts/internals';

const outSeriesTypes: Set<'funnel'> = new Set(['funnel']);

const keyboardFocusHandler: KeyboardFocusHandler<'funnel', 'funnel'> =
  createKeyboardFocusHandler(outSeriesTypes);

export default keyboardFocusHandler;
