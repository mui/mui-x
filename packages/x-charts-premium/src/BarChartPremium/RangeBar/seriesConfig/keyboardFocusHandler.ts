import {
  composableCartesianSeriesTypes,
  createCommonKeyboardFocusHandler,
} from '@mui/x-charts/internals';
import type {
  KeyboardFocusHandler,
  ComposableCartesianChartSeriesType,
} from '@mui/x-charts/internals';

const allowCycles = false;
const useCurrentSeriesMaxLength = false;

const keyboardFocusHandler: KeyboardFocusHandler<'rangeBar', ComposableCartesianChartSeriesType> =
  createCommonKeyboardFocusHandler<ComposableCartesianChartSeriesType, 'rangeBar'>(
    composableCartesianSeriesTypes,
    allowCycles,
    useCurrentSeriesMaxLength,
  );

export default keyboardFocusHandler;
