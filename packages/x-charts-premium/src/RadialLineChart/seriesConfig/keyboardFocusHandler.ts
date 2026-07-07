import {
  createCommonKeyboardFocusHandler,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableRadialChartSeriesType,
} from '@mui/x-charts/internals';

const keyboardFocusHandler: KeyboardFocusHandler<'radialLine', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableRadialChartSeriesType, 'radialLine'>(
    composableRadialSeriesTypes,
  );

export default keyboardFocusHandler;
