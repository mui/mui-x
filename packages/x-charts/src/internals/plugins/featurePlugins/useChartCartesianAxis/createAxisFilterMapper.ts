import { isDefined } from '../../../isDefined';
import { AxisId, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from '../../../../models/axis';
import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';
import { AxisConfig } from '../../../../models';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { getAxisExtremum } from './getAxisExtremum';
import { DefaultizedZoomOptions, ExtremumFilter } from './useChartCartesianAxis.types';
import { GetZoomAxisFilters, ZoomAxisFilters, ZoomData } from './zoom.types';
import { getScale } from '../../../getScale';

type CreateAxisFilterMapperParams = {
  zoomMap: Map<AxisId, ZoomData>;
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>;
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>;
  formattedSeries: ProcessedSeries;
  direction: 'x' | 'y';
};

export function createAxisFilterMapper(params: {
  zoomMap: Map<AxisId, ZoomData>;
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>;
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>;
  formattedSeries: ProcessedSeries;
  direction: 'x';
}): (
  axis: AxisConfig<ScaleName, any, ChartsXAxisProps>,
  axisIndex: number,
) => ExtremumFilter | null;
export function createAxisFilterMapper(params: {
  zoomMap: Map<AxisId, ZoomData>;
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>;
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>;
  formattedSeries: ProcessedSeries;
  direction: 'y';
}): (
  axis: AxisConfig<ScaleName, any, ChartsYAxisProps>,
  axisIndex: number,
) => ExtremumFilter | null;
export function createAxisFilterMapper({
  zoomMap,
  zoomOptions,
  seriesConfig,
  formattedSeries,
  direction,
}: CreateAxisFilterMapperParams) {
  return (axis: AxisConfig, axisIndex: number): ExtremumFilter | null => {
    const zoomOption = zoomOptions[axis.id];
    if (!zoomOption || zoomOption.filterMode !== 'discard') {
      return null;
    }

    const zoom = zoomMap?.get(axis.id);

    if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
      // No zoom, or zoom with all data visible
      return null;
    }

    let extremums: number[] = [];
    const scaleType = axis.scaleType;

    if (scaleType === 'point' || scaleType === 'band') {
      extremums = [0, (axis.data?.length ?? 1) - 1];
    } else {
      extremums = getAxisExtremum(axis, direction, seriesConfig, axisIndex, formattedSeries);
    }

    let min: number | Date;
    let max: number | Date;

    const continuousScaleType =
      !scaleType || scaleType === 'band' || scaleType === 'point' ? 'linear' : scaleType;

    [min, max] = getScale(continuousScaleType, extremums, [0, 100]).nice().domain();

    min = min instanceof Date ? min.getTime() : min;
    max = max instanceof Date ? max.getTime() : max;

    const minVal = min + (zoom.start * (max - min)) / 100;
    const maxVal = min + (zoom.end * (max - min)) / 100;

    return (value, dataIndex) => {
      const val = value[direction] ?? axis.data?.[dataIndex];

      if (val == null) {
        // If the value does not exist because of missing data point, or out of range index, we just ignore.
        return true;
      }

      if (axis.scaleType === 'point' || axis.scaleType === 'band' || typeof val === 'string') {
        return dataIndex >= minVal && dataIndex <= maxVal;
      }

      return val >= minVal && val <= maxVal;
    };
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
