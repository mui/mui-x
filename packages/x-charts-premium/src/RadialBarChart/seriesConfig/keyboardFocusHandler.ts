import {
  createCommonKeyboardFocusHandler,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableRadialChartSeriesType,
} from '@mui/x-charts/internals';

const allowCycles = false;
// Shared-axis navigation: allow focusing valueless indexes up to the longest compatible series.
const useCurrentSeriesMaxLength = false;

const keyboardFocusHandler: KeyboardFocusHandler<'radialBar', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableRadialChartSeriesType, 'radialBar'>(
    composableRadialSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
