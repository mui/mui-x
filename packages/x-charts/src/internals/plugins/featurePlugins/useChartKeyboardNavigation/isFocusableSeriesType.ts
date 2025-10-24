import { ChartSeriesType } from '../../../../models/seriesType/config';
import { FocusableSeriesTypes } from './useChartKeyboardNavigation.types';

const FOCUSABLE_SERIES_TYPES = new Set(['bar', 'line', 'scatter', 'pie']);

export function isFocusableSeriesType(type: ChartSeriesType): type is FocusableSeriesTypes {
  return FOCUSABLE_SERIES_TYPES.has(type);
}
