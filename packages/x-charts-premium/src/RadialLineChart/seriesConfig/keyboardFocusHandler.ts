import {
  createCommonKeyboardFocusHandler,
  type KeyboardFocusHandler,
  type ComposableRadialChartSeriesType,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'radialLine', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableRadialChartSeriesType, 'radialLine'>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
