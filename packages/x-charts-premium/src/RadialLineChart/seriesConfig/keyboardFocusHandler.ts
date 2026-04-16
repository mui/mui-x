import {
  createCommonKeyboardFocusHandler,
  type KeyboardFocusHandler,
  type ComposableRadialChartSeriesType,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'radialLine', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<'radialLine', ComposableRadialChartSeriesType>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
