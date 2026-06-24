import {
  composableCartesianSeriesTypes,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableCartesianChartSeriesType,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableCartesianChartSeriesType, 'rangeBar'>(
    composableCartesianSeriesTypes,
  );

export default keyboardFocusHandler;
