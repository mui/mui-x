import {
  composableCartesianSeriesTypes,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableCartesianChartSeriesType,
} from '@mui/x-charts/internals';

const allowCycles = false;
// Shared-axis navigation: allow focusing valueless indexes up to the longest compatible series.
const useCurrentSeriesMaxLength = false;

const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableCartesianChartSeriesType, 'rangeBar'>(
    composableCartesianSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
