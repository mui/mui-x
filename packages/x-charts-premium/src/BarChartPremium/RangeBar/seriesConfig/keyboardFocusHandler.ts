import {
  createGetNextIndexFocusedItem,
  createGetPreviousIndexFocusedItem,
  createGetNextSeriesFocusedItem,
  createGetPreviousSeriesFocusedItem,
  type KeyboardFocusHandler,
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> = (
  event,
) => {
  switch (event.key) {
    case 'ArrowRight':
      return createGetNextIndexFocusedItem(composableCartesianSeriesTypes);
    case 'ArrowLeft':
      return createGetPreviousIndexFocusedItem(composableCartesianSeriesTypes);
    case 'ArrowDown':
      return createGetPreviousSeriesFocusedItem(composableCartesianSeriesTypes);
    case 'ArrowUp':
      return createGetNextSeriesFocusedItem(composableCartesianSeriesTypes);
    default:
      return null;
  }
};

export default keyboardFocusHandler;
