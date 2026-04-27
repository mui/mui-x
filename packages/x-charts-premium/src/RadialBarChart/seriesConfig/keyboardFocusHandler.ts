import {
  createCommonKeyboardFocusHandler,
  type KeyboardFocusHandler,
  type ComposableRadialChartSeriesType,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'radialBar', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableRadialChartSeriesType, 'radialBar'>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
