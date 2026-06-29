import {
  createCommonKeyboardFocusHandler,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableRadialChartSeriesType,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'radialBar', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableRadialChartSeriesType, 'radialBar'>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
