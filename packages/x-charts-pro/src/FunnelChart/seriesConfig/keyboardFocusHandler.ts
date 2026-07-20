import { createCommonKeyboardFocusHandler } from '@mui/x-charts/internals';
import type { KeyboardFocusHandler } from '@mui/x-charts/internals';

const outSeriesTypes: Set<'funnel'> = new Set(['funnel']);

const allowCycles = false;
const useCurrentSeriesMaxLength = true;

const keyboardFocusHandler: KeyboardFocusHandler<'funnel', 'funnel'> =
  createCommonKeyboardFocusHandler<'funnel', 'funnel'>(
    outSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
