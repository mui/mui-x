import {
  type KeyboardFocusHandler,
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableCartesianChartSeriesType | 'rangeBar'>(
    composableCartesianSeriesTypes,
  );

export default keyboardFocusHandler;
