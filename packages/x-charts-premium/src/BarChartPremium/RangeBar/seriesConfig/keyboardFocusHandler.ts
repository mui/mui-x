import {
  type KeyboardFocusHandler,
  type ComposableCartesianChartSeriesType,
  composableCartesianSeriesTypes,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';


const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler(
    composableCartesianSeriesTypes,
  ) as KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType>;

export default keyboardFocusHandler;
