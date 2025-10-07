import { NumberValue } from '@mui/x-charts-vendor/d3-scale';
import { isDefined } from '../../../isDefined';
import { AxisConfig } from '../../../../models';
import { ExtremumFilter } from './useChartCartesianAxis.types';
import { GetZoomAxisFilters, ZoomAxisFilters } from './zoom.types';

export function createDiscreteScaleGetAxisFilter(
  axisData: AxisConfig['data'],
  zoomStart: number,
  zoomEnd: number,
  direction: 'x' | 'y',
): ExtremumFilter {
  const maxIndex = axisData?.length ?? 0;

  const minVal = Math.floor((zoomStart * maxIndex) / 100);
  const maxVal = Math.ceil((zoomEnd * maxIndex) / 100);

  return function filterAxis(value, dataIndex) {
    const val = value[direction] ?? axisData?.[dataIndex];

    if (val == null) {
      // If the value does not exist because of missing data point, or out of range index, we just ignore.
      return true;
    }

    return dataIndex >= minVal && dataIndex < maxVal;
  };
}

export function createContinuousScaleGetAxisFilter(
  domain: NumberValue[],
  zoomStart: number,
  zoomEnd: number,
  direction: 'x' | 'y',
  axisData: AxisConfig['data'],
): ExtremumFilter {
  const min = domain[0].valueOf();
  const max = domain[1].valueOf();

  const minVal = min + (zoomStart * (max - min)) / 100;
  const maxVal = min + (zoomEnd * (max - min)) / 100;

  return function filterAxis(value, dataIndex) {
    const val = value[direction] ?? axisData?.[dataIndex];

    if (val == null) {
      // If the value does not exist because of missing data point, or out of range index, we just ignore.
      return true;
    }

    return val >= minVal && val <= maxVal;
  };
}

export const createGetAxisFilters =
  (filters: ZoomAxisFilters): GetZoomAxisFilters =>
  ({ currentAxisId, seriesXAxisId, seriesYAxisId, isDefaultAxis }) => {
    return (value, dataIndex) => {
      const axisId = currentAxisId === seriesXAxisId ? seriesYAxisId : seriesXAxisId;

      if (!axisId || isDefaultAxis) {
        return Object.values(filters ?? {})[0]?.(value, dataIndex) ?? true;
      }

      const data = [seriesYAxisId, seriesXAxisId]
        .filter((id) => id !== currentAxisId)
        .map((id) => filters[id ?? ''])
        .filter(isDefined);
      return data.every((f) => f(value, dataIndex));
    };
  };
