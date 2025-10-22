import { ChartSeriesType } from '../../../../models/seriesType/config';
import { FocusableSeriesTypes } from './useChartKeyboardNavigation.types';

export function isFocusableSeriesType(type: ChartSeriesType): type is FocusableSeriesTypes {
  if (type === 'bar' || type === 'line' || type === 'scatter' || type === 'pie') {
    return true;
  }
  return false;
}
