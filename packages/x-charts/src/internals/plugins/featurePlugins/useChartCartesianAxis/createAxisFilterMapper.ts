import { isDefined } from '../../../isDefined';
import { AxisId, D3ContinuousScale, D3Scale } from '../../../../models/axis';
import { AxisConfig } from '../../../../models';
import { DefaultizedZoomOptions, ExtremumFilter } from './useChartCartesianAxis.types';
import { GetZoomAxisFilters, ZoomAxisFilters, ZoomData } from './zoom.types';
import { isOrdinalScale } from '../../../scaleGuards';

export function createAxisFilterMapper(
  zoomMap: Map<AxisId, ZoomData>,
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>,
  direction: 'x' | 'y',
): (axisId: AxisId, axisData: AxisConfig['data'], scale: D3Scale) => ExtremumFilter | null {
  return (axisId: AxisId, axisData: AxisConfig['data'], scale: D3Scale): ExtremumFilter | null => {
    const zoomOption = zoomOptions[axisId];
    if (!zoomOption || zoomOption.filterMode !== 'discard') {
      return null;
    }

    const zoom = zoomMap?.get(axisId);

    if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
      // No zoom, or zoom with all data visible
      return null;
    }

    if (isOrdinalScale(scale)) {
      return createDiscreteScaleGetAxisFilter(axisData, zoom.start, zoom.end, direction);
    }

    return createContinuousScaleGetAxisFilter(scale, zoom.start, zoom.end, direction, axisData);
  };
}

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
  scale: D3ContinuousScale,
  zoomStart: number,
  zoomEnd: number,
  direction: 'x' | 'y',
  axisData: AxisConfig['data'],
): ExtremumFilter {
  let min: number | Date;
  let max: number | Date;

  [min, max] = scale.domain();

  min = min instanceof Date ? min.getTime() : min;
  max = max instanceof Date ? max.getTime() : max;

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
