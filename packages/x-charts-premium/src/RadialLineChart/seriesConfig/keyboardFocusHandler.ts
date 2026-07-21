import {
  createCommonKeyboardFocusHandler,
  composableRadialSeriesTypes,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableRadialChartSeriesType,
} from '@mui/x-charts/internals';

const allowCycles = false;
const useCurrentSeriesMaxLength = false;

const keyboardFocusHandler: KeyboardFocusHandler<'radialLine', ComposableRadialChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableRadialChartSeriesType, 'radialLine'>(
    composableRadialSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
