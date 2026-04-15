import {
  createCommonKeyboardFocusHandler,
  type KeyboardFocusHandler,
  type ComposableRadialChartSeriesType,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'radial-line', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<'radial-line', ComposableRadialChartSeriesType>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
