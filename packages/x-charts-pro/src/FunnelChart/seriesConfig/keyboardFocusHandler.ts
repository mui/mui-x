import {
  type KeyboardFocusHandler,
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
} from '@mui/x-charts/internals';

const outSeriesTypes: Set<'funnel'> = new Set(['funnel']);

const keyboardFocusHandler: KeyboardFocusHandler<'funnel', 'funnel'> = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      return createGetNextIndexFocusedItem(outSeriesTypes);
    case 'ArrowLeft':
      return createGetPreviousIndexFocusedItem(outSeriesTypes);
    case 'ArrowDown':
      return createGetPreviousSeriesFocusedItem(outSeriesTypes);
    case 'ArrowUp':
      return createGetNextSeriesFocusedItem(outSeriesTypes);
    default:
      return null;
  }
};

export default keyboardFocusHandler;
