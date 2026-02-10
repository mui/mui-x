import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
  type KeyboardFocusHandler,
} from '@mui/x-charts/internals';

const outSeriesTypes: Set<'rangeBar' | 'bar' | 'line' | 'scatter'> = new Set([
  'rangeBar',
  'bar',
  'line',
  'scatter',
]);

const keyboardFocusHandler: KeyboardFocusHandler<
  'rangeBar',
  'rangeBar' | 'bar' | 'line' | 'scatter'
> = (event) => {
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
